const btnMyLocation = document.getElementById('btn-my-location');
const adressInput = document.getElementById('adress');
const map = L.map('map').setView([60.3954816, 5.3377375], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 50,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function fetchAdress(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then((response) => response.json())
    .then((data) => {
        const string = `Adresse: ${data.address.road} ${data.address.house_number}, ${data.address.postcode} ${data.address.city}, ${data.address.country}`;
      console.log(string);
    })
    .catch((error) => {
      console.log('Something went wrong', error);
    });
  // alert("You clicked the map at " + e.latlng);
}

function onMapClick(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  fetchAdress(lat, lng);
}

map.on('click', onMapClick);

btnMyLocation.addEventListener('click', () => {
  //Create a little get my location button so this one doesnt run automatically ;)
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const marker = new L.marker([lat, long], {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    //We can update the input field this way
    adressInput.value = `${marker.getLatLng().lat}, ${marker.getLatLng().lng}`;

    //We dont even need to click the marker, we can use this
    console.log('Using getLatLng(): ', marker.getLatLng().lat);
    console.log('Using getLatLng(): ', marker.getLatLng().lng);

    //Instantly gets the marker adress when clicking the marker
    marker.addEventListener('click', (e) => {
      console.log('You clicked a marker', e.latlng.lat, e.latlng.lng);
    });

    //Sets the map view to current positions
    map.setView([lat, long], 13);

    console.log('Using current position', lat);
    console.log(long);
  });
});
