export function fetchUserData(JSObject) {
const staffs = JSObject.get('staffs') //Reference to the actual object stored under staffs in the Employee map
const { users, seed } = JSObject.get('config')

  return fetch(`https://randomuser.me/api/?results=${users}&seed=${seed}`)
  .then(response => response.json())
  .then(data => {
    const { results } = data;
    
    //Destructuring the results
    for (const { name, picture, email } of results) {
      const {first, last} = name, {medium} = picture;

      staffs[`${first}.${last}`] = { //directly mutates the staffs object in the EMPLOYEES map
        picture: medium,
        name: first,
        surname: last,
        email: email
      }      
    }
    console.log('API: Call was successful')
    return staffs
  })
  .catch(error => console.log('Something went wrong', error))
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
};