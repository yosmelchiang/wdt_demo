import { fetchAdressFromCoords } from '../api/wdt_api.js';

export const DOMLocation = {
  //Properties
  DOM: null, //Where we will be storing our DOM elements, only relevant to the map features
  mapInstance: null, // Where we will be storing our map instance each time its created

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

    showMapButtons() {
      const { locBtn, mapBtn } = DOMLocation.DOM;
      if (locBtn.style.display === 'none' || mapBtn.style.display === 'none') {
        locBtn.style.display = 'inline';
        mapBtn.style.display = 'inline';
      }
    }
  },

  map: {
    getInstance() {
      const { mapDiv } = DOMLocation.DOM,
        { addGeoSearch } = DOMLocation.map;

      if (mapDiv.style.display === 'flex') {
        mapDiv.style.display = 'none';
      } else {
        mapDiv.style.display = 'flex';
        if (!DOMLocation.mapInstance) {
          // Creating a map instance
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

    getAdress({ lat, long }, type) {
      const { adressInput } = DOMLocation.DOM;

      if (type === 'input') {
        navigator.geolocation.getCurrentPosition((position) => {
          const { coords } = position,
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
