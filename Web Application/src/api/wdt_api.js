export function staffUserGet() {
  let users = {};

  return fetch('https://randomuser.me/api/?results=5&seed=wdt')
    .then((response) => response.json())
    .then((data) => {
      const apiUserData = data.results;

      for (let i = 0; i < apiUserData.length; i++) {
        const picture = apiUserData[i].picture.medium;
        const fName = apiUserData[i].name.first;
        const lName = apiUserData[i].name.last;
        const email = apiUserData[i].email;

        //Creating a key for our users object based on firstname and lastname
        const key = `${fName}.${lName}`;

        //We are parsing the JSON data into an object, where we only want picture, name, surname and email.
        users[key] = {
          picture: picture,
          name: fName,
          surname: lName,
          email: email
        };
      }
      return users;
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