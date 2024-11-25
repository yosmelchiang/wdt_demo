let mapInstance = null;

export function toggleMap() {
  const mapDiv = document.getElementById('map');

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

    //Waits a second, to ensure DOM is updates
    setTimeout(() => {
      const adressInput = document.getElementById('sch-adress');
      const useAdressBtn = document.getElementById('use-address');

      if (useAdressBtn) {
        useAdressBtn.addEventListener('click', () => {
          adressInput.value = adress;
          toggleMap();
        });
      }
    }, 1000);
  });
}

export function fetchAdress(lat, lng) {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then((response) => response.json())
    .then((data) => {
      const string = `${data.address.road} ${data.address.house_number}, ${data.address.postcode} ${data.address.city}, ${data.address.country}`;
      return string;
    })
    .catch((error) => {
      console.log('Something went wrong', error);
    });
}
