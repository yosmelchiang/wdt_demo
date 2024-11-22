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

//We are going to use this map to store Staff instances created by the outButton
const staffMap = new Map();

// DOM Elements
const tableRow = document.getElementsByClassName('selectedRow');

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
// const toastBody = toastWindow.getElementsByClassName('toast-body')[0];
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);

// createToast('Julio');

// Date variables
let d; // Where we will be storing and updating date object
// let currentTimeInMinutes; //Current time in minutes, for use in calculations

class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

class Staff extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherits name and surname from Employee
    this.picture = JSObject.picture; //Staff-specific properties
    this.email = JSObject.email;
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';
  }

  staffOut(outTime, expectedRTime) {
    this.outTime = outTime;
    this.expectedRTime = expectedRTime;
    this.status = 'Out';
    tableRow[0].cells[4].innerHTML = this.status; //Changes the HTML element status
  }

  staffIn() {
    this.status = 'In';
    tableRow[0].cells[4].innerHTML = this.status; //Changes the HTML element status
  }

  checkLateness() {
    const checkIfLate = setInterval(() => {
      if (this.status === 'Out') {
        const expectedReturnTimeInMins = convertHoursToMinutes(this.expectedRTime); //We can just put this in the if statement to simplify

        if (expectedReturnTimeInMins <= currentTimeInMinutes()) {
          const toastContainer = document.getElementsByClassName('toast-container')[0];
          const id = `${this.name}.${this.surname}`;

          //Create the outer div
          const toast = document.createElement('div');

          //The reason for why we are creating a whole toast section in here instead of html and accessing it is because if
          //We generate toast elements within a toast container, they will stack, according to bootstrap documentation :)
          //We also want to get rid of each toast once they are timed out, or closed
          toast.innerHTML = `
          <div id="${id}" class="toast text-bg-danger border-0 p-3 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header text-bg-danger border-0">
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              <img src="${this.picture}" alt="Staff Picture">
              <p>${this.name} ${this.surname} is late!</p>
              <p>Late by: ${currentTimeInMinutes() - expectedReturnTimeInMins} mins</p>
            </div>
          </div>
        `;

          toastContainer.appendChild(toast);

          //Activate bootstrap
          const toastWindow = document.getElementById(`${id}`);
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
          toastBootstrap.show();

          toastWindow.addEventListener('hidden.bs.toast', () => {
            toast.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
          });

          clearInterval(checkIfLate);
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, 1000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
    return checkIfLate;
  }
}

class Delivery extends Employee {
  constructor(vehicle, name, surname, phone, adress, expectedRTime) {
    super(name, surname); //Inherit name and surname from Employee
    this.vehicle = vehicle;
    this.phone = phone;
    this.adress = adress;
    this.expectedRTime = expectedRTime;
  }

  checkLateness() {
    const checkIfLate = setInterval(() => {
      const expectedReturnTimeInMins = convertHoursToMinutes(this.expectedRTime); //We can just put this in the if statement to simplify

      if (expectedReturnTimeInMins <= currentTimeInMinutes()) {
        const toastContainer = document.getElementsByClassName('toast-container')[0];
        const id = `${this.name}.${this.surname}`;

        //Create the outer div
        const toast = document.createElement('div');

        //The reason for why we are creating a whole toast section in here instead of html and accessing it is because if
        //We generate toast elements within a toast container, they will stack, according to bootstrap documentation :)
        //We also want to get rid of each toast once they are timed out, or closed
        toast.innerHTML = `
        <div id="${id}" class="toast text-bg-danger border-0 p-3 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header text-bg-danger border-0">
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            <p>${this.name} ${this.surname} is late!</p>
            <p>Late by: ${currentTimeInMinutes() - expectedReturnTimeInMins} mins</p>
          </div>
      </div>
      `;

        toastContainer.appendChild(toast);

        //Activate bootstrap
        const toastWindow = document.getElementById(`${id}`);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
        toastBootstrap.show();

        toastWindow.addEventListener('hidden.bs.toast', () => {
          toast.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
        });
        clearInterval(checkIfLate);
      }
    }, 1000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
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
        //Our JSON data returns info (object) and results (array) (5)
        const userData = data.results; // We using only the results array (5) of user data fetched from the API.

        //We are going to iterate through each array and create an object (jsUser) with specific properties for each.
        for (let i = 0; i < userData.length; i++) {
          //We are parsing the JSON data into an object, where we only want picture, name, surname and email.
          const jsUser = {
            picture: userData[i].picture.large,
            name: userData[i].name.first,
            surname: userData[i].name.last,
            email: userData[i].email
          };

          const staffID = jsUser.name + '.' + jsUser.surname; //We are creating an ID based on the user's first name and surname for our map
          const staffMember = new Staff(jsUser); //Represents a single instance of the Staff class
          const newRow = document.createElement('tr');

          //Populate the DOM table with user data from our Staff instance.
          newRow.innerHTML = `
          <td><img src="${staffMember.picture}" alt="Staff Picture"></td> 
          <td>${staffMember.name}</td>
          <td>${staffMember.surname}</td>
          <td>${staffMember.email}</td>
          <td>${staffMember.status}</td>
          <td>${staffMember.outTime}</td>
          <td>${staffMember.duration}</td>
          <td>${staffMember.expectedRTime}</td>
          `;
          staffTableBody.appendChild(newRow);

          staffMap.set(staffID, staffMember); //We are storing this instance in our map so we can use it outside of the promise
        }
        staffRowSelection(); //Enables the selection of rows in staff table
      })
      .catch((error) => console.log('Error fetching users: ', error));
  })();
});

function getRowId() {
  const name = tableRow[0].getElementsByTagName('td')[1].innerText;
  const surname = tableRow[0].getElementsByTagName('td')[2].innerText;
  return name + '.' + surname;
}

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
  // currentTimeInMinutes = d.getHours() * 60 + d.getMinutes();
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

function timeStamp() {
  let d = new Date();
  const hh = addZero(d.getHours());
  const mm = addZero(d.getMinutes());
  return `${hh}:${mm}`;
}

function currentTimeInMinutes() {
  let d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

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

/** BUTTON handlers for populating the outTime, duration and expected return
 */
outButton.addEventListener('click', function () {
  if (tableRow.length > 0) {
    const outTime = timeStamp();
    const userDuration = getUserDuration(); //Asks the user for duration and validates, returns time in minutes format
    const userDurationFormatted = convertMinutesToHours(userDuration); //Formats from minutes to hours, returns in HH:MM format.
    const calculateReturnTime = createReturnTimeCalculator(currentTimeInMinutes());
    const expectedRTimeFormatted = returnTimeFormat(calculateReturnTime(userDuration)); //Calculates expected Return Time, returns in HH:MM format.

    const staffID = getRowId();
    const staffInstance = staffMap.get(staffID);

    if (staffInstance) {
      //Updating the page with Staff instance properties for visibility
      tableRow[0].cells[5].innerHTML = outTime;
      tableRow[0].cells[6].innerHTML = userDurationFormatted;
      tableRow[0].cells[7].innerHTML = expectedRTimeFormatted;

      //Marks staff as out and checks for lateness
      staffInstance.staffOut(outTime, expectedRTimeFormatted); //staffOut method sets the instance status property to Out and updated the HTML DOM element as well
      staffInstance.checkLateness(); //Running the checkLateness method from our newly created instance, which initiates lateness check interval
    }

    tableRow[0].classList.toggle('selectedRow'); //Removes the CSS class from the row
  }
});

inButton.addEventListener('click', function () {
  if (tableRow.length > 0) {
    const staffID = getRowId();
    const staffInstance = staffMap.get(staffID);

    if (staffInstance) {
      staffInstance.staffIn();
      tableRow[0].classList.toggle('selectedRow');
    }
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

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

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

  delivery.checkLateness();

  deliveryRowSelection(); //Enables the selection of rows in delivery board
});

clearBtn.addEventListener('click', () => {
  // const dableRow = deliveryBody.getElementsByClassName('selectedRow');

  for (let i = 0; i < tableRow.length; i++) {
    tableRow[i].remove();
  }
});
