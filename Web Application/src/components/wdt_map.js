let mapInstance = null;

export function toggleMap() {
  const mapDiv = document.getElementById('map');
  
  if(mapDiv.style.display === 'flex'){
    mapDiv.style.display = 'none';
    
  } else {
    mapDiv.style.display = 'flex'
    if(!mapInstance) {
      mapInstance = L.map('map').setView([60.3954816, 5.3377375], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 50,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstance);
    }
    }
    map.invalidateSize();
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
