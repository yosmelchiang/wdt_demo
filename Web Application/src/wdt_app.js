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

const userAmount = 5; // The amount of users we want to fetch from randomuser.me API
const seed = 'wdt'; // A specific seed query parameter so we dont get random users on every fetch
const apiUrl = `https://randomuser.me/api/?results=${userAmount}&seed=${seed}`;

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
        rowSelectionClick();
      })
      .catch((error) => console.log('Error: ', error));
  })();
});

/** Row selection
 * @description - This function applies a specific css styling class for mouse selected rows of staff table
 */
function rowSelectionClick() {
  const rows = staffTableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', rowSelectedBg);
  }
}

function rowSelectedBg() {
  this.classList.toggle('rowSelection');
}

/**
 * @description - This functions checks wether the returned time variables have a zero next to it or not, if not add one.
 *              - Valid output: 02 h : 50 mins
 *              - Invalid output: 2 h: 5 mins
 * @param {Number} i - We know by default that the Date object returns integers less than 10 without a Zero next to it
 * @returns {Number} - If Date is less than 10, Returns the original number with a Zero concatenated to it
 */
function addZero(i) {
  return i < 10 ? `0${i}` : `${i}`;
}

// Date and time configuration

//Empty variable where we will be storing and updating date object from within a function
let d;

//Current time in minutes, for use in calculations for the staff table
let currentTimeInMinutes;

//IIFE that will keep calling itself with a 1 second delay
(function updateDateAndTime() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  d = new Date();
  currentTimeInMinutes = d.getHours() * 60 + d.getMinutes();
  const hh = addZero(d.getHours());
  const mm = addZero(d.getMinutes());
  const ss = addZero(d.getSeconds());
  const currentTime = `${hh}:${mm}:${ss}`;

  const day = days[d.getDay()];
  const monthName = months[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const currentDate = `${day}, ${monthName} ${date}, ${year} at`;

  //Update the HTML element with the current date and time.
  document.getElementById('dateAndTime').innerHTML = `${currentDate} ${currentTime}`;

  //Schedule a new update with 1 second delay between each update
  setTimeout(() => {
    updateDateAndTime();
  }, 1000);
})();

console.log('currentTimeInMinutes:', currentTimeInMinutes);

/**
 * @description - Higher order function which takes the current time in minutes, and the additional passed time in minutes.
 *              - The inner function alculates these together to return the time in hour back, this is going to be the Expected Return Time.
 * @param {Number} baseMinutes  - Takes the current base time in minutes
 * @returns {Function} - Takes additional time in minutes, which then is calculated to a total time from minutes to hours
 */

function createReturnTimeCalculator(baseMinutes) {
  return function (additionalMinutes) {
    const totalMinutes = baseMinutes + additionalMinutes;
    return totalMinutes;
  };
}
function returnTimeFormat(totalMinutes) {
  const hours = parseInt(totalMinutes / 60);
  const minutes = Math.round((totalMinutes / 60 - hours) * 60);
  return `${addZero(hours)}:${addZero(minutes)}`;
}

//Initialize the return time calculator with the current time
const calculateReturnTime = createReturnTimeCalculator(currentTimeInMinutes);

/**
 * @description - Validates the user input for duration.
 *              - We are looking to validate empty input, non numeric values and negative numbers
 * @param {String} input - The user input.
 * @returns {Boolean} - This will be true if the input is invalid, false otherwise
 */
function isInvalidInput(input) {
  return input.trim() === '' || isNaN(input) || input <= 0;
}

/**
 * @description - Prompts the user for a duration, the prompt is only passed on valid input.
 * @returns {number} - Valid duration in number, no negative numbers allowed.
 */
function getUserDuration() {
  while (true) {
    const userInput = prompt('How long are you going to be gone for?');
    if (!isInvalidInput(userInput)) {
      return parseInt(userInput);
    } else {
      alert('Invalid input, try again');
    }
  }
}

/**
 * @description - This function formats the time from user input into a string.
 * @param {Number} totalMinutes - Takes a duration in minutes as a parameter.
 * @returns {String} - Returns a formatted duration string.
 */
function formatDuration(totalMinutes) {
  const hours = parseInt(totalMinutes / 60);
  const minutes = Math.round(totalMinutes - hours * 60);
  return minutes === 0 ? `${hours} h` : `${hours} h: ${minutes} m`;
}

/**
 * @description - Updates the selected row with out time, duration and expected return time.
 * @param {HTMLElement} row - The selected row to populate.
 * @param {*} outTime - The formatted out time.
 * @param {*} duration - The formated duration.
 * @param {*} returnTime - The expected return time.
 */
function updateRowCells(row, outTime, duration, returnTime) {
  //Convert to OOP
  row.cells[4].innerHTML = 'Out';
  row.cells[5].innerHTML = outTime;
  row.cells[6].innerHTML = duration;
  row.cells[7].innerHTML = returnTime;
}

/**
 * Button handlers for populating the outTime, duration and expected return
 */
outButton.addEventListener('click', function () {
  const selectedRows = document.getElementsByClassName('rowSelection');
  const name = selectedRows[0].getElementsByTagName('td')[1].innerText;
  const surname = selectedRows[0].getElementsByTagName('td')[2].innerText;

  if (selectedRows.length > 0) {
    const hh = addZero(d.getHours());
    const mm = addZero(d.getMinutes());
    const outTimeStamp = `${hh}:${mm}`;
    const userDuration = getUserDuration();
    const formattedDuration = formatDuration(userDuration);
    const expectedReturnTime = returnTimeFormat(calculateReturnTime(userDuration));
    const expectedReturnTimeInMins = calculateReturnTime(userDuration);
    console.log('expectedReturnTime:', expectedReturnTime);
    console.log('expectedReturnTimeInMins:', expectedReturnTimeInMins);

    updateRowCells(selectedRows[0], outTimeStamp, formattedDuration, expectedReturnTime);

    const checkIfLate = setInterval(() => {
      if (expectedReturnTimeInMins < currentTimeInMinutes) {
        console.log(`${name} is late`);
        clearInterval(checkIfLate);
      }
    }, 1000);
  }
});

inButton.addEventListener('click', function () {
  const status = document.getElementsByClassName('rowSelection');
  if (status.length > 0) {
    status[0].cells[4].innerHTML = 'In';
  }
});
