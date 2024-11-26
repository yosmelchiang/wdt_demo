import { fetchAdress } from '../api/wdt_api.js';

// #region MAP INSTANCE
const locBtn = document.getElementById('btn-location');
const mapBtn = document.getElementById('btn-map');
const mapDiv = document.getElementById('map');
let mapInstance = null;

export function enableMapFeatures() {
 if(locBtn.style.display === 'none' || mapBtn.style.display === 'none') {
  locBtn.style.display = 'inline'
  mapBtn.style.display = 'inline'
 }
}

export function showMap() {
  if (mapBtn) {
    mapBtn.addEventListener('click', toggleMap);
  } else {
    console.log('Map button was not found');
  }
}

export function toggleMap() {
  const adressInput = document.getElementById('sch-adress');

  if (mapDiv.style.display === 'flex') {
    mapDiv.style.display = 'none';
  } else {
    mapDiv.style.display = 'flex';
    if (!mapInstance) {
      mapInstance = L.map('map').setView([60.3954816, 5.3377375], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstance);

      const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        style: 'bar'
      });

      mapInstance.addControl(search);
    }
  }
  mapInstance.invalidateSize();

  mapInstance.on('tileerror', (error) => {
    console.log('Something went wrong loading tiles', error);
  });

  mapInstance.on('geosearch/showlocation', (result) => {
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
          toggleMap();
          adressInput.value = adress;
          document.getElementById('sch-rtime').focus(); //Sets focus on return time.
        });
      }
    }, 1000);
  });
}

// #endregion

// #region GET LOCATION
export function getLocation() {
  locBtn.addEventListener('click', () => {
    const adressInput = document.getElementById('sch-adress');

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      fetchAdress(lat, lng)
        .then((data) => {
          adressInput.value = data;
        })
        .catch((error) => {
          console.log('Something went wront', error);
        });
    });
  });
}
// #endregion

// #region POPOVER
export function showPopover() {
  const addressInput = document.getElementById('sch-adress');

  // Bootstrap Popover instance
  const popover = new bootstrap.Popover(addressInput, {
    trigger: 'manual', // We'll control when it shows and hides
    content: `
  <div>
    Use the <i class="bi bi-crosshair"></i> button to autofill your adress<br>
    Use the <i class="bi bi-globe2"></i> button to type in and find it manually.
  </div>
`
  });

  // Show popover on focus
  addressInput.addEventListener('focus', () => {
    popover.show();
  });

  // Hide popover on blur
  addressInput.addEventListener('blur', () => {
    popover.hide();
  });
}
// #endregion
