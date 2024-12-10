/**
 *
 * @param {Object} JSObject - This function receives an object of key-value pairs, in our case its going to be a Map of keys containing empty objects.
 * @returns We are creating a direct reference to the 'staff' key, iterating through the results of our api resoinse and creating a new object for our 'staff' key each time.
 */
export function fetchUserData(JSObject) {
  const staffs = JSObject.get('staffs'); // Reference to the actual object stored under staffs in the Employee map
  const { users, seed } = JSObject.get('config'); // Paremeters for our API URL

  return fetch(`https://randomuser.me/api/?results=${users}&seed=${seed}`)
    .then((response) => response.json())
    .then((data) => {
      const { results } = data; // Destructuring our data with results which is what we are interested in for now.

      //Destructuring the results, creating a new object of each and assigning it to our staff key of the EMPLOYEE map.
      for (const { name, picture, email } of results) {
        const { first, last } = name,
          { medium } = picture;

        // Here we are directly assigning a new object to staffs in the EMPLOYEES map.
        staffs[`${first}.${last}`] = {
          picture: medium,
          name: first,
          surname: last,
          email: email
        };
      }
      console.log('API: Call was successful');
      return staffs;
    })
    .catch((error) => console.log('Something went wrong', error));
}

export function fetchAdressFromCoords(JSOBject) {
  const { latitude, longitude } = JSOBject;
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      const { address } = data;
      const { road, house_number, postcode, city, country } = address;
      return `${road} ${house_number}, ${postcode} ${city}, ${country}`;
    })
    .catch((error) => console.log('Something went wrong', error));
}
