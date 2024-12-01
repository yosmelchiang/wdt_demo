// #region IMPORTS

// API Imports
import { staffUserGet } from './api/wdt_api.js';

// Factory Pattern
import { factory } from './classes/wdt_factory.js';

/// Event Listeners
import { formEnterKeyListener } from './events/wdt_event.js';

// Components
import { enableMapFeatures, getLocation, showMap, showPopover } from './components/wdt_map.js';

// Classes
import { staffIn, staffOut } from './classes/wdt_staff.js';
import { addDelivery, clearDelivery } from './classes/wdt_delivery.js';

// #endregion

// #region DOM Elements

// DOM Elements
const staffTable = document.getElementById('staff'); //Main table of staff members
const staffTableBody = staffTable.getElementsByTagName('tbody')[0]; //Staff table body

const inButton = document.getElementById('btn-in');
const outButton = document.getElementById('btn-out');

const scheduleDelivery = document.getElementById('schedule');
const scheduleVehicle = scheduleDelivery.getElementsByTagName('select');
const scheduleInputs = scheduleDelivery.getElementsByTagName('input');

const deliveryTable = document.getElementById('delivery'); //Main delivery board table
const deliveryTableBody = deliveryTable.getElementsByTagName('tbody')[0]; //Delivery table body
const addBtn = document.getElementById('btn-add');
const clearBtn = document.getElementById('btn-clear');
const clock = document.getElementById('dateAndTime');
const digitalClock = factory.createEmployee('time', new Date());

const formInputs = document.querySelectorAll('#schedule input');

const toastContainer = document.getElementsByClassName('toast-container')[0]; //Toast container
// #endregion

// #region EXTRA FEATURES
(function extraFeatures() {
  if (false) {
    //Set to true to enable extra features
    enableMapFeatures(); //This function simply hides/shows current location and map icons from the DOM
    getLocation(); //Gets the current user location
    showPopover(); //Shows a little popover when focusing the adress input
    showMap(); //Allows the user to use the map to find an adress
    formEnterKeyListener(formInputs, addBtn); // This function will allow the ENTER key to submit to Delivery Board
  }
})();
// #endregion

// #region DIGITAL CLOCK

//Initializes the date and real-time display clock

digitalClock.updateClock(clock);

// #endregion

// #region MAPS
//This map will be used to ensure proper use of DOM elements as well as to ensure we dont accidentally enter duplicate users
const EMPLOYEES = new Map();
EMPLOYEES.set('DOM Elements', { toastContainer, staffTableBody, deliveryTableBody });

// #endregion

// #region GET USERS FROM API
window.addEventListener('load', () => {
  console.log('All elements have loaded');
  staffUserGet(EMPLOYEES);
});

// #endregion

// #region STAFF IN/OUT
outButton.addEventListener('click', () => {
  const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
  if (selectedRows.length > 0) {
    const rows = Array.from(selectedRows);
    staffOut(rows, EMPLOYEES);
    return;
  }
  alert("You haven't selected any rows, please select one or more rows and try again.");
});

inButton.addEventListener('click', () => {
  const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
  if (selectedRows.length > 0) {
    const rows = Array.from(selectedRows);
    staffIn(rows, EMPLOYEES);
    return;
  }
  alert("You haven't selected any rows, please select one or more rows and try again.");
});
// #endregion

// #region DELIVERIES ADD/CLEAR
addBtn.addEventListener('click', () => {
  const { vehicle } = scheduleVehicle;
  const { fname, lname, phone, adress, rtime } = scheduleInputs;

  const vehIcon =
    vehicle.value === 'Car'
      ? `<i class="fa fa-car" aria-hidden="true"></i>`
      : `<i class="fa-solid fa-motorcycle"></i>`;

  addDelivery(
    {
      vehicle: vehIcon,
      name: fname.value,
      surname: lname.value,
      phone: phone.value,
      adress: adress.value,
      expectedRTime: rtime.value
    },
    EMPLOYEES
  );

  //Clear the table values
  for (const inputs of scheduleInputs) {
    inputs.value = '';
  }
});

clearBtn.addEventListener('click', () => {
  const selectedRow = deliveryTableBody.getElementsByClassName('selectedRow');

  const rows = Array.from(selectedRow);

  clearDelivery(rows, EMPLOYEES);
});
// #endregion
