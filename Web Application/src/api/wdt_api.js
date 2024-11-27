import { Staff } from '../classes/wdt_staff.js';

export function staffUserGet(staffMap) {
  return fetch('https://randomuser.me/api/?results=5&seed=wdt')
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

        // Creating a staffID for the staffMap key
        const staffID = `${jsObject.name}.${jsObject.surname}`;

        if (!staffMap.has(staffID)) { // Create a new Staff instance only if the ID doesn't already exists in our map
          const newStaff = new Staff(jsObject);

          staffMap.set(staffID, newStaff);
        }
      }
      return staffMap; // Return the updated staffMap
    })
    .catch((error) => console.log('Error fetching users: ', error));
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
