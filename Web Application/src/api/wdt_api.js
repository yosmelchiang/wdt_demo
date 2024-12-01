import { factory } from '../classes/wdt_factory.js';
import { enableRowSelection } from '../events/wdt_event.js';
import { populateRow } from '../utils/wdt_utility.js';

// #region API Calls

export function staffUserGet(EMPLOYEES) {
  const { staffTableBody } = EMPLOYEES.get('DOM Elements')
  
  fetchUser()
  .then(staffs => {
    for (const staff in staffs) {
      const staffID = staff;
      const staffMember = staffs[staff];

      EMPLOYEES.set(staffID, staffMember);
      populateRow(staffTableBody, staffMember, 'staff');
    }
    enableRowSelection(staffTableBody, 'staff');
  })
  .catch(error => console.log('Something went wrong', error))
}

function fetchUser() {
  let staffs = {};

  return (
    fetch('https://randomuser.me/api/?results=5&seed=wdttm')
      .then(response => response.json())
      // // Destructure data and create instances for each user
      .then(({ results: data }) => {
        for (const { name, picture, email } of data) {
          const { first, last } = name;
          const { medium } = picture;

          const staffInstance = factory.createEmployee('staff', {
            picture: medium,
            name: first,
            surname: last,
            email: email
          });

          const staffID = staffInstance.id;
          staffs[staffID] = staffInstance;
        }
        return staffs;
      })
      .catch((error) => console.log('Error fetching users: ', error))
  );
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
