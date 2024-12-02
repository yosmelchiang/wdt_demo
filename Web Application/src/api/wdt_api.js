import { factory } from '../classes/wdt_factory.js';

// #region API Calls

export function getData(JSObject) {


  return fetch('https://randomuser.me/api/?results=5&seed=wdttm')
  .then(response => response.json())
  .then(data => {
    const { results } = data;
    
    for (const { name, picture, email } of results) {
      const {first, last} = name, {medium} = picture;

      JSObject[`${first}.${last}`] = {
        picture: medium,
        name: first,
        surname: last,
        email: email
      }      
    }
    console.log('API Call and Fetch was successful')
    return JSObject
  })
  .catch(error => console.log('Something went wrong', error))
}

// #endregion

// #region Fetch current location adress (Additional feature)
export function fetchAdress(lat, lng) {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then((response) => response.json())
    .then((data) => {
      const { address } = data;
      const { road, house_number, postcode, city, country } = address
      return `${road} ${house_number}, ${postcode} ${city}, ${country}`;
    })
    .catch((error) => {
      console.log('Something went wrong', error);
    });
}
// #endregion
