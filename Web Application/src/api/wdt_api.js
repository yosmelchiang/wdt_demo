import { factory } from '../classes/wdt_factory.js';

// #region API Calls
export function staffUserGet() {
  let staffs = {};

  return fetch('https://randomuser.me/api/?results=5&seed=wdttm')
    .then((response) => response.json())
    .then((data) => {
      const users = data.results;

      for (let i = 0; i < users.length; i++) {
        const jsObject = { //Creating an Object for each fetched user of our API call
          picture: users[i].picture.medium,
          name: users[i].name.first,
          surname: users[i].name.last,
          email: users[i].email
        };

        const staffInstance = factory.createEmployee('staff', jsObject)
        
        //getter
        // const staffID = `${jsObject.name}.${jsObject.surname}`; //we can implement a class getter to get rid of this process
        const staffID = staffInstance.id; //we can implement a class getter to get rid of this process

        staffs[staffID] = staffInstance
      }
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