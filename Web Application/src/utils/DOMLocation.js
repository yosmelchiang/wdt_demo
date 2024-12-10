import { fetchAdressFromCoords } from '../api/wdt_api.js';

/**
 * Map and location based features that use external libraries such as Leaflet, Leaflet-GeoSearch and Nominatim API.
 */
export const DOMLocation = {
  //Properties
  DOM: null, //Where we will be storing our DOM elements, only relevant to the map features
  mapInstance: null, // Where we will be storing our map instance each time its created

  // Initiates the DOM elements used for this functionality as well as enables the buttons and listeners.
  init() {
    const { getDOMElements, showMapButtons } = this.elements,
      { addListeners } = this.utils;
    //Check if DOM elements have loaded
    this.DOM = getDOMElements;
    console.log(
      Object.keys(this.DOM).length > 0 ? 'Map: features loaded' : 'Map: features not loaded'
    );

    //Enable map buttons
    showMapButtons();

    //Listeners
    addListeners();
  },

  elements: {
    get getDOMElements() {
      return {
        locBtn: document.getElementById('btn-location'),
        mapBtn: document.getElementById('btn-map'),
        mapDiv: document.getElementById('map'),
        adressInput: document.getElementById('sch-adress'),
        useAdressBtn: document.getElementById('use-address')
      };
    },

    // This function can be called to show/hide the map buttons.
    showMapButtons() {
      const { locBtn, mapBtn } = DOMLocation.DOM;
      if (locBtn.style.display === 'none' || mapBtn.style.display === 'none') {
        locBtn.style.display = 'inline';
        mapBtn.style.display = 'inline';
      }
    }
  },

  map: {
    /**
     * @description - Creates a map instance using the Leaflet library,
     */
    getInstance() {
      const { mapDiv } = DOMLocation.DOM,
        { addGeoSearch } = DOMLocation.map;

      if (mapDiv.style.display === 'flex') {
        //This condition allows the user show/hide the map based on its display state. Initially it is set to none to hide the map from the start.
        mapDiv.style.display = 'none';
      } else {
        mapDiv.style.display = 'flex';
        if (!DOMLocation.mapInstance) {
          //We have defined an empty object as a property of this scope. Here we are checking if there is not a mapInstance already, then we create one.
          // Creating a map instance with Leaflet
          DOMLocation.mapInstance = L.map('map').setView([60.3954816, 5.3377375], 13); //We cant destructure map instance because we are trying to update the property itself, destructuring creates a copy of the reference

          // Creating tile layer
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(DOMLocation.mapInstance);

          DOMLocation.mapInstance.on('tileerror', (error) => {
            console.log('Something went wrong loading tiles', error);
          });

          DOMLocation.mapInstance.invalidateSize(); //Since we are hiding/showing our map, this will ensure proper recalculation of map size

          addGeoSearch();
        }
      }
    },

    /**
     * The getAdress uses a combination of the Geolocation API (see docs: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) and the Nominatim API
     * Geolocation API is built-in and allows the user to provide their location to our application. There is a security step, where the user is asked for permissions.
     * The Geolocation API gives us some coordinates we can destructure and call the Nominatim API to convert into a readable adress.
     * The Nominatim API works with an object as well and destrctures latitude and longitude to make the API call required.
     * The API response we get from Nominatim can then be desctured once more and translated to an adress including Road name, house number, postcode, city, country and more.
     * @param {Object} param0 - Object containing latitude and longitude numbres
     * @param {String} type - The type of adress we are working with, is it from an input field or from a map control.
     */
    getAdress({ lat, long }, type) {
      const { adressInput } = DOMLocation.DOM;

      if (type === 'input') {
        navigator.geolocation.getCurrentPosition((position) => {
          const { coords } = position.toJSON(), // toJSON() is a method of GeoLocation API
            { latitude, longitude } = coords;

          fetchAdressFromCoords({ latitude, longitude }).then((data) => (adressInput.value = data));
        });
      } else if (type === 'geosearch') {
        fetchAdressFromCoords({ latitude: lat, longitude: long }).then((data) => {
          adressInput.value = data; // Plots in the adress into the form input
          DOMLocation.map.getInstance(); //Closes the map
        });
      }
    },

    //We are adding a GeoSearch control to our map, this is supported by by: https://smeijer.github.io/leaflet-geosearch/
    addGeoSearch() {
      const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        style: 'bar'
      });

      DOMLocation.mapInstance.addControl(search).on('geosearch/showlocation', (result) => {
        const { location } = result,
          { x: longitude, y: latitude } = location,
          marker = result.marker,
          adress = result.location.label;

        //We have created a little marker, with a button to be able to use the found adress.
        marker
          .bindPopup(
            `
              <div>
                <p>${adress}</p>
                <button id="use-address" style="cursor: pointer; color: blue; text-decoration: underline; background: none; border: none;">
                  Use this address
                </button>
              </div>
            `
          )
          .openPopup();

        //Waits a second, to ensure DOM is updated.
        setTimeout(() => {
          const useAdressBtn = document.getElementById('use-address');
          if (useAdressBtn) {
            useAdressBtn.addEventListener('click', () => {
              DOMLocation.map.getAdress({ lat: latitude, long: longitude }, 'geosearch');
            });
          }
        }, 100);
      });
    }
  },

  utils: {
    addListeners() {
      const { mapBtn, locBtn } = DOMLocation.DOM,
        { getInstance, getAdress } = DOMLocation.map;

      locBtn.addEventListener('click', () => getAdress({}, 'input'));
      mapBtn.addEventListener('click', () => getInstance());
    }
  }
};
