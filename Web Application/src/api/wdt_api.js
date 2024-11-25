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

        ///#region Some old code, need this for
        //   const staffID = jsUser.name + '.' + jsUser.surname; //We are creating an ID based on the user's first name and surname for our map

        //   //If the staff is not already in the map, create an instance and popuate the table
        //   if (!staffMap.has(staffID)) {
        //     const staffMember = new Staff(jsUser); //Represents a single instance of the Staff class
        //     const newRow = document.createElement('tr');

        //     //Populate the DOM table with user data from our Staff instance.
        //     newRow.innerHTML = `
        //     <td><img src="${staffMember.picture}" alt="Staff Picture"></td>
        //     <td>${staffMember.name}</td>
        //     <td>${staffMember.surname}</td>
        //     <td>${staffMember.email}</td>
        //     <td>${staffMember.status}</td>
        //     <td>${staffMember.outTime}</td>
        //     <td>${staffMember.duration}</td>
        //     <td>${staffMember.expectedRTime}</td>
        //     `;
        //     staffTableBody.appendChild(newRow);

        //     staffMap.set(staffID, staffMember); //We are storing this instance in our map so we can use it outside of the promise
        //   } else {
        //     console.log('Something went wrong');
        //   }
        ///#endregion
      }
      return users;
    })
    .catch((error) => console.log('Error fetching users: ', error));
}
