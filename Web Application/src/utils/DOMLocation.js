import { fetchAdressFromCoords } from '../api/wdt_api.js';

export const DOMLocation = {
  //Properties
  DOM: null, //Where we will be storing our DOM elements, only relevant to the map features
  mapInstance: null, // Where we will be storing our map instance each time its created

  init() {
    //Check if DOM elements have loaded
    this.DOM = this.getDOMElements;
    console.log(
      Object.keys(this.DOM).length > 0 ? 'Map: features loaded' : 'Map: features not loaded'
    );

    //Enable map buttons
    this.mapButtons();

    //Listeners
    this.addListeners();
  },

  //Getters
  get getDOMElements() {
    return {
      locBtn: document.getElementById('btn-location'),
      mapBtn: document.getElementById('btn-map'),
      mapDiv: document.getElementById('map'),
      adressInput: document.getElementById('sch-adress'),
      useAdressBtn: document.getElementById('use-address')
    };
  },

  //Methods
  addListeners() {
    const { mapBtn, locBtn } = this.DOM;

    locBtn.addEventListener('click', () => this.getUserLocation());
    mapBtn.addEventListener('click', () => this.getMap());
  },

  mapButtons() {
    const { locBtn, mapBtn } = this.DOM;
    if (locBtn.style.display === 'none' || mapBtn.style.display === 'none') {
      locBtn.style.display = 'inline';
      mapBtn.style.display = 'inline';
    }
  },

  getUserLocation() {
    const { adressInput } = this.DOM;

    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position,
        { latitude, longitude } = coords;

      fetchAdressFromCoords({ latitude, longitude }).then((data) => (adressInput.value = data));
    });
  },

  getMap() {
    const { mapDiv } = this.DOM;

    if (mapDiv.style.display === 'flex') {
      mapDiv.style.display = 'none';
    } else {
      mapDiv.style.display = 'flex';
      if (!this.mapInstance) {
        // Creating a map instance
        this.mapInstance = L.map('map').setView([60.3954816, 5.3377375], 13);

        // Creating tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.mapInstance);

        this.mapInstance.on('tileerror', (error) => {
          console.log('Something went wrong loading tiles', error);
        });

        this.mapInstance.invalidateSize(); //Since we are hiding/showing our map, this will ensure proper recalculation of map size

        this.GeoSearch();
      }
    }
  },

  GeoSearch() {
    const { adressInput } = this.DOM;

    const search = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
      style: 'bar'
    });

    this.mapInstance.addControl(search);

    this.mapInstance.on('geosearch/showlocation', (result) => {
      const { location } = result;
      const { x: longitude, y: latitude } = location;

      const marker = result.marker;
      const adress = result.location.label;

      marker.bindPopup(`
              <div>
                <p>${adress}</p>
                <button id="use-address" style="cursor: pointer; color: blue; text-decoration: underline; background: none; border: none;">
                  Use this address
                </button>
              </div>
            `);

      marker.openPopup();

      //Waits a second, to ensure DOM is updated.
      setTimeout(() => {
        const useAdressBtn = document.getElementById('use-address');

        if (useAdressBtn) {
          useAdressBtn.addEventListener('click', () => {
            fetchAdressFromCoords({ latitude, longitude }).then((data) => {
              adressInput.value = data; // Plots in the adress into the form input
              this.getMap(); //Closes the map
            });
          });
        }
      }, 100);
    });
  }
};
