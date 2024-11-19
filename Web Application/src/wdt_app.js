/**
 * HTML Elements
 */
const staffTable = document.getElementById('staff'); //Main table of staff members
const staffTableBody = staffTable.getElementsByTagName('tbody')[0]; //Staff table body
const inButton = document.getElementById('btn-in');
const outButton = document.getElementById('btn-out');

/**
 * Employee Classes
 */

class Employee {
  constructor(user) {
    this.name = user.name.first;
    this.surname = user.name.last;
  }
}

class Staff extends Employee {
  constructor(user) {
    super(user);
    this.picture = user.picture.large;
    this.email = user.email;
    this.status = 'In';
    this.outTime = 0;
    this.duration = 0;
    this.expectedRTime = 0;
  }

  staffMemberIsLate() {
    console.log("You're late");
  }
}

const apiUrl = 'https://randomuser.me/api/?results=5&seed=noroffbed1';

window.addEventListener('load', () => {
  // This function will use the randomuser.me api to fetch random users
  // Here we have provided a seed to always fetch the same users and also specified a paremeter of 5 user results
  // IIFE - Immediately invoked Function Expression - Will run immediately once the page has fully loaded
  (function fetchUsers() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.results;

        for (let i = 0; i < userData.length; i++) {
          const newRow = document.createElement('tr');
          const staff = new Staff(userData[i]);

          newRow.innerHTML = `
            <td><img src="${staff.picture}"></td> 
            <td>${staff.name}</td>
            <td>${staff.surname}</td>
            <td>${staff.email}</td>
            <td>${staff.status}</td>
            <td>${staff.outTime}</td>
            <td>${staff.duration}</td>
            <td>${staff.expectedRTime}</td>
            `;
          staffTableBody.appendChild(newRow);
        }
        rowSelection();
      })
      .catch((error) => console.log('Error: ', error));
  })();
});

function createUser(name, surname, picture, email, status, outTime, duration, expectedRTime) {}

/** Row selection
 * @description - This function applies a specific css styling class for mouse selected rows of staff table
 */
function rowSelection() {
  const rows = staffTableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function () {
      this.classList.toggle('rowSelection');
    });
  }
}

/**
 * Date, time and button handlers
 */
function addZero(i) {
  if (i < 10) {
    i = 0 + i;
  }
  return i;
}
const d = new Date();
let hh = addZero(d.getHours());
let mm = addZero(d.getMinutes());

outButton.addEventListener('click', function () {
  const status = document.getElementsByClassName('rowSelection');
  if (status.length > 0) {
    status[0].cells[4].innerHTML = 'Out';
    let loggedOutTime = hh + ':' + mm;
    status[0].cells[5].innerHTML = loggedOutTime;
  }
});

inButton.addEventListener('click', function () {
  const status = document.getElementsByClassName('rowSelection');
  if (status.length > 0) {
    status[0].cells[4].innerHTML = 'In';
  }
});

// let date = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`

// let ss = d.getSeconds();
// console.log('ss:', ss)

// let time = hh + ':' + mm + ':' + ss
// console.log('time:', time)

// function addTime(number) {
//     let hour = 3600;
//     let minutes = 60;
//     let seconds = 60;

//     if (number < 60) {
//         ss = ss + number
//     }
// }

// addTime(24)
