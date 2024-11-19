const staffTable = document.getElementById('staff');
const staffTableBody = staffTable.getElementsByTagName('tbody')[0];

// Api url and query parameter for 5 unique users
const apiUrl = 'https://randomuser.me/api/?results=5&seed=noroffbed1';

/**
 * API fetch and user creation function call
 */
//Will perform the fetch after everything on the DOM has been loaded
window.addEventListener('load', () => {
  // This function will use the randomuser.me api to fetch random users
  // Here we have provided a seed to always fetch the same users and also specified a paremeter of 5 user results
  // IIFE - Immediately invoked Function Expression - Will run immediately once the page has fully loaded
  (function fetchUsers() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.results.length; i++) {
          const picture = data.results[i].picture.large;
          const fname = data.results[i].name.first;
          const lname = data.results[i].name.last;
          const email = data.results[i].email;
          createUser(picture, fname, lname, email);
        }
        rowSelection();
      })
      .catch((error) => console.log('Error: ', error));
  })();
});

/** User creation and table population
 * @description - This function will get the DOM elements to the staff table and populate a new child element of type 'tr'
 * @param {Image} picture - Profile picture of the user
 * @param {String} fname - First name of the user
 * @param {String} lname - Last name of the user
 * @param {String} email - User email adress
 */
function createUser(picture, fname, lname, email) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td><img src="${picture}"></td>
    <td>${fname}</td>
    <td>${lname}</td>
    <td>${email}</td>
    `;
  staffTableBody.appendChild(newRow);
}

/** Row selection
 * @description - This function applies a specific css styling class for mouse selected rows of staff table
 */
function rowSelection() {
  const rows = staffTableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function () {
      this.classList.toggle('rowSelection');
      console.log(this);
    });
  }
}


