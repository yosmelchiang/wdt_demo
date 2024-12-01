import { factory } from '../classes/wdt_factory.js';

// #region API Calls

/**
 * Fetches staff users form the Random Usre API and returns a map of staff instances.
 * @returns {Object} Map of staff instances indexed by ID
 */
export function staffUserGet() {
  let staffs = {};

  return fetch('https://randomuser.me/api/?results=5&seed=wdttm')
    .then((response) => response.json())
    .then((data) => {

      // Learning how to destructure data
      for (const { name, picture, email } of data.results) {

        const { first, last } = name
        const { medium } = picture

        const JSObj = {
          picture: medium,
          name: first,
          surname: last,
          email: email
        }

        const staffInstance = factory.createEmployee('staff', JSObj)        
        const staffID = staffInstance.id;
        staffs[staffID] = staffInstance
      }


      // const users = data.results;

      // for (let i = 0; i < users.length; i++) {
        
      //   const jsObject = { //Creating an Object for each fetched user of our API call
      //     picture: users[i].picture.medium,
      //     name: users[i].name.first,
      //     surname: users[i].name.last,
      //     email: users[i].email
      //   };
        
      //   const staffInstance = factory.createEmployee('staff', jsObject)
        
      //   const staffID = staffInstance.id;

      //   staffs[staffID] = staffInstance
      // }
      console.log(staffs)
      return staffs;
    })
    .catch((error) => console.log('Error fetching users: ', error));
}
// #endregion

// #region Fetch current location adress (Additional feature)
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
// #endregion