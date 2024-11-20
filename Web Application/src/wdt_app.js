//Constants
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = [
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

// DOM Elements
const staffTable = document.getElementById('staff'); //Main table of staff members
const staffTableBody = staffTable.getElementsByTagName('tbody')[0]; //Staff table body
const inButton = document.getElementById('btn-in');
const outButton = document.getElementById('btn-out');
const toastWindow = document.getElementById('liveToast');
const toastBody = toastWindow.getElementsByClassName('toast-body')[0];
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);

// Date variables
let d; // Where we will be storing and updating date object
let currentTimeInMinutes; //Current time in minutes, for use in calculations

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

  updateRow(row) {
    row.cells[4].textContent = this.status;
    row.cells[5].textContent = this.outTime;
    row.cells[6].textContent = this.duration;
    row.cells[7].textContent = this.expectedRTime;
  }
}

window.addEventListener('load', () => {
  // This function will use the randomuser.me api to fetch random users
  // Here we have provided a seed to always fetch the same users and also specified a paremeter of 5 user results
  // IIFE - Immediately invoked Function Expression - Will run immediately once the page has fully loaded
  (function fetchUsers() {
    fetch('https://randomuser.me/api/?results=5&seed=wdt')
      .then((response) => response.json())
      .then((data) => {
        const userData = data.results;

        for (let i = 0; i < userData.length; i++) {
          const staff = new Staff(userData[i]);
          const newRow = document.createElement('tr');

          newRow.innerHTML = `
          <td><img src="${staff.picture}" alt="Profile Picture"></td> 
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
      .catch((error) => console.log('Error fetching users: ', error));
  })();
});

/** ROW SELECTION
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

/** DATE AND TIME FUNCTIONS
 * @description - This functions checks wether the returned time variables have a zero next to it or not, if not add one.
 *              - Valid output: 02 h : 50 mins
 *              - Invalid output: 2 h: 5 mins
 * @param {Number} i - We know by default that the Date object returns integers less than 10 without a Zero next to it
 * @returns {Number} - If Date is less than 10, Returns the original number with a Zero concatenated to it
 */
function addZero(i) {
  return i < 10 ? `0${i}` : `${i}`;
}

//IIFE that will keep calling itself with a 1 second delay
(function updateDateAndTime() {
  d = new Date();
  currentTimeInMinutes = d.getHours() * 60 + d.getMinutes();
  const hh = addZero(d.getHours());
  const mm = addZero(d.getMinutes());
  const ss = addZero(d.getSeconds());

  const currentTime = `${hh}:${mm}:${ss}`;
  const day = DAYS[d.getDay()];
  const monthName = MONTHS[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const currentDate = `${day}, ${monthName} ${date}, ${year} at`;

  //Update the DOM with the current date and time.
  document.getElementById('dateAndTime').textContent = `${currentDate} ${currentTime}`;

  //Schedule a new update with 1 second delay between each update
  setTimeout(updateDateAndTime, 1000);
})();

/** RETURN TIME CALCULATOR MINUTES
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

/** RETURN TIME HH:MM FORMAT
 * @param {Number} totalMinutes - Takes in minuts and turns them to hh:mm
 * @returns {String} - String of hours and minutes
 */
function returnTimeFormat(totalMinutes) {
  const hours = parseInt(totalMinutes / 60);
  const minutes = Math.round((totalMinutes / 60 - hours) * 60);
  return `${addZero(hours)}:${addZero(minutes)}`;
}

/** INPUT VALIDATOR
 * @description - Validates the user input for duration.
 *              - We are looking to validate empty input, non numeric values and negative numbers
 * @param {String} input - The user input.
 * @returns {Boolean} - This will be true if the input is invalid, false otherwise
 */
function isInvalidInput(input) {
  return input.trim() === '' || isNaN(input) || input <= 0;
}

/** PROMPT AND CHECKS FOR VALID OUT LENGTH
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

/** FORMATS OUT DURATION TO HOURS AND MINUTES
 * @description - This function formats the time from user input into a string.
 * @param {Number} totalMinutes - Takes a duration in minutes as a parameter.
 * @returns {String} - Returns a formatted duration string.
 */
function formatDuration(totalMinutes) {
  const hours = parseInt(totalMinutes / 60);
  const minutes = Math.round(totalMinutes - hours * 60);
  return minutes === 0 ? `${hours} h` : `${hours} h: ${minutes} m`;
}

//Initialize the return time calculator with the current time
const calculateReturnTime = createReturnTimeCalculator(currentTimeInMinutes);

/** UPDATE HTML DOM CELL ELEMENTS
 * @description - Updates the selected row with out time, duration and expected return time.
 * @param {HTMLElement} row - The selected row to populate.
 * @param {String} outTime - The formatted out time in string
 * @param {String} duration - The formated duration in string.
 * @param {String} returnTime - The expected return time in string.
 */
function updateRowCells(row, outTime, duration, returnTime) {
  //Convert to OOP
  row.cells[4].innerHTML = 'Out';
  row.cells[5].innerHTML = outTime;
  row.cells[6].innerHTML = duration;
  row.cells[7].innerHTML = returnTime;
}

/** BUTTON handlers for populating the outTime, duration and expected return
 */
outButton.addEventListener('click', function () {
  const selectedRows = document.getElementsByClassName('rowSelection');

  if (selectedRows.length > 0) {
    const profilePicture = selectedRows[0].getElementsByTagName('td')[0].innerHTML;
    const name = selectedRows[0].getElementsByTagName('td')[1].innerText;
    const surname = selectedRows[0].getElementsByTagName('td')[2].innerText;

    const toastContent = document.createElement('div');

    const hh = addZero(d.getHours());
    const mm = addZero(d.getMinutes());

    const outTimeStamp = `${hh}:${mm}`;
    const userDuration = getUserDuration();
    const formattedDuration = formatDuration(userDuration);
    const expectedReturnTime = returnTimeFormat(calculateReturnTime(userDuration));
    const expectedReturnTimeInMins = calculateReturnTime(userDuration);

    updateRowCells(selectedRows[0], outTimeStamp, formattedDuration, expectedReturnTime);

    const checkIfLate = setInterval(() => {
      if (expectedReturnTimeInMins <= currentTimeInMinutes) {
        //Less or Equals to, so we dont have to wait another minute while testing :/

        toastContent.innerHTML = `
        ${profilePicture}
        <p>${name} ${surname} is late!</p>
        <p>Late by: ${currentTimeInMinutes - expectedReturnTimeInMins} mins</p>
        `;
        toastBody.appendChild(toastContent);

        toastBootstrap.show();
        clearInterval(checkIfLate);
      }
    }, 1000);
    // toastContent.remove(); //Might want to clear up the div so it can be reused
  }
});

inButton.addEventListener('click', function () {
  const status = document.getElementsByClassName('rowSelection');
  if (status.length > 0) {
    status[0].cells[4].innerHTML = 'In';
  }
});
