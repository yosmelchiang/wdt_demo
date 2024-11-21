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

const schVehicle = document.getElementById('sch-vehicle');
const schName = document.getElementById('sch-fname');
const schSurname = document.getElementById('sch-lname');
const schPhone = document.getElementById('sch-phone');
const schAdress = document.getElementById('sch-adress');
const schReturnTime = document.getElementById('sch-rtime');
const addBtn = document.getElementById('btn-add');

const deliveryTable = document.getElementById('delivery'); //Main delivery board table
const deliveryBody = deliveryTable.getElementsByTagName('tbody')[0]; //Delivery table body
const clearBtn = document.getElementById('btn-clear');

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

class Delivery {
  constructor(vehicle, name, surname, phone, adress, expectedRTime) {
    this.vehicle = vehicle;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.adress = adress;
    this.expectedRTime = expectedRTime;
  }

  checkLateness(returnTimeInMins) {
    const expectedReturnTimeInMins = convertHoursToMinutes(returnTimeInMins);
    const checkIfLate = setInterval(() => {
      const toastContent = document.createElement('div');

      if (expectedReturnTimeInMins <= currentTimeInMinutes) {
        toastContent.innerHTML = `
        <p>${this.name} ${this.surname} is late!</p>
        <p>Late by: ${currentTimeInMinutes - expectedReturnTimeInMins} mins</p>
        `;
        toastBody.appendChild(toastContent);

        toastBootstrap.show();
        clearInterval(checkIfLate);

        toastWindow.addEventListener('hidden.bs.toast', () => {
          toastContent.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
        });
      }
    }, 1000);
    return checkIfLate;
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
        staffRowSelection(); //Enables the selection of rows in staff table
      })
      .catch((error) => console.log('Error fetching users: ', error));
  })();
});

/** STAFF ROW SELECTION
 * @description - This function applies a specific css styling class for mouse selected rows of staff table.
 * @function staffRowSelection - Uses a simple for loop to iterate all the rows and add a class to it that
 * we can use for styling as well as DOM manipulation when interacting with the table.
 */
function staffRowSelection() {
  const sRows = staffTableBody.getElementsByTagName('tr');

  for (let i = 0; i < sRows.length; i++) {
    sRows[i].addEventListener('click', function () {
      this.classList.toggle('selectedRow');
    });
  }
}

/** DELIVERY BOARD ROW SELECTION
 * @description - This function applies a specific css styling class for mouse selected rows of delivery board table.
 * @function deliveryRowSelection - Compared to the staffRowSelection function, this table is dynamically populated,
 * which means we need to be able to allow each old and new row to be interacted with after creation. This demands the need to apply event listeners to each one.
 * We have achieved this by checking if rows have a certain attribute (delivery in this case) if not, add the attribute and also add the eventListener so we can interact with it.
 */
function deliveryRowSelection() {
  const dRows = deliveryBody.getElementsByTagName('tr');

  for (let i = 0; i < dRows.length; i++) {
    const delivery = dRows[i].hasAttribute('delivery');

    if (!delivery) {
      dRows[i].addEventListener('click', function () {
        this.classList.toggle('selectedRow');
      });
      dRows[i].setAttribute('delivery', 'true');
    }
  }
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
  //Outfunc receives the global time in minutes
  return function (additionalMinutes) {
    //Inner function receives a specific time in minutes
    const totalMinutes = baseMinutes + additionalMinutes; //Calculates total minutes for later reference
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

/** PROMPT AND CHECKS FOR VALID OUT DURATION
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

/** FORMATS OUT DURATION (mins) TO HOURS AND MINUTES ( HH: MM )
 * @description - This function formats the time from user input into a string.
 * @param {Number} totalMinutes - Takes a duration in minutes as a parameter.
 * @returns {String} - Returns a formatted duration string.
 */
function convertMinutesToHours(totalMinutes) {
  const hours = parseInt(totalMinutes / 60);
  const minutes = Math.round(totalMinutes - hours * 60);
  return minutes === 0 ? `${hours} h` : `${hours} h: ${minutes} m`;
}

function convertHoursToMinutes(time) {
  const timeParts = time.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  return hours * 60 + minutes;
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
  const selectedRows = document.getElementsByClassName('selectedRow');

  if (selectedRows.length > 0) {
    const profilePicture = selectedRows[0].getElementsByTagName('td')[0].innerHTML;
    const name = selectedRows[0].getElementsByTagName('td')[1].innerText;
    const surname = selectedRows[0].getElementsByTagName('td')[2].innerText;

    const hh = addZero(d.getHours());
    const mm = addZero(d.getMinutes());

    const outTimeStamp = `${hh}:${mm}`;
    const userDuration = getUserDuration(); //Asks the user for duration and validates, returns time in minutes format
    const formattedDuration = convertMinutesToHours(userDuration); //Formats from minutes to HH:MM
    const expectedReturnTime = returnTimeFormat(calculateReturnTime(userDuration)); //Calculates expected Return Time and return sin HH:MM format
    const expectedReturnTimeInMins = calculateReturnTime(userDuration);

    updateRowCells(selectedRows[0], outTimeStamp, formattedDuration, expectedReturnTime);

    const checkIfLate = setInterval(() => {
      const toastContent = document.createElement('div');
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
  const status = document.getElementsByClassName('selectedRow');
  if (status.length > 0) {
    status[0].cells[4].innerHTML = 'In';
  }
});

// Schedule delivery stuff

function validateInputs() {
  let errorMessage = '';

  if (schName.value.trim() === '' || !isNaN(schName.value)) {
    errorMessage = 'Name cannot be empty or a number.';
  } else if (schSurname.value.trim() === '' || !isNaN(schSurname.value)) {
    errorMessage = 'Surname cannot be empty or a number.';
  } else if (schPhone.value.trim() === '') {
    errorMessage = 'Phone cannot be empty or a number.';
  } else if (isNaN(schPhone.value)) {
    errorMessage = 'Phone must be a valid number.'; //Should we use this validation at all?
    // HTML input type is number so that is already sorted out, but what about length? Video shows 7 digits phone validation
  } else if (schAdress.value.trim() === '') {
    errorMessage = 'Adress cannot be empty.';
  } else if (schReturnTime.value.trim() === '') {
    errorMessage = 'Return time cannot be empty.';
  }

  return errorMessage;
}
addBtn.addEventListener('click', () => {
  const errorMessage = validateInputs();
  console.log('errorMessage:', errorMessage);

  if (errorMessage) {
    alert(errorMessage);
  } else {
    const delivery = new Delivery(
      schVehicle.value,
      schName.value,
      schSurname.value,
      schPhone.value,
      schAdress.value,
      schReturnTime.value
    );

    //Populate delivery board table
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${delivery.vehicle}</td>
    <td>${delivery.name}</td>
    <td>${delivery.surname}</td>
    <td>${delivery.phone}</td>
    <td>${delivery.adress}</td>
    <td>${delivery.expectedRTime}</td>
    `;

    deliveryBody.appendChild(newRow);

    delivery.checkLateness(schReturnTime.value);

    deliveryRowSelection(); //Enables the selection of rows in delivery board
  }
});

clearBtn.addEventListener('click', () => {
  const selectedRows = deliveryBody.getElementsByClassName('selectedRow');

  for (let i = 0; i < selectedRows.length; i++) {
    selectedRows[i].remove();
  }
});
