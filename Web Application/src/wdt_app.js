import { staffUserGet } from './api/wdt_api.js';
import { enableRowSelection, formEnterKeyListener } from './events/wdt_event.js';
import { populateRow, digitalClock } from './utils/wdt_utility.js';
import { staffIn, staffOut } from './classes/wdt_staff.js';
import { addDelivery, clearDelivery } from './classes/wdt_delivery.js';
import { enableMapFeatures, getLocation, showMap, showPopover } from './components/wdt_map.js';

// #region DOM Elements
// DOM Elements
const staffTable = document.getElementById('staff'); //Main table of staff members
const staffTableBody = staffTable.getElementsByTagName('tbody')[0]; //Staff table body

const inButton = document.getElementById('btn-in');
const outButton = document.getElementById('btn-out');

const deliveryTable = document.getElementById('delivery'); //Main delivery board table
const deliveryTableBody = deliveryTable.getElementsByTagName('tbody')[0]; //Delivery table body
const addBtn = document.getElementById('btn-add');
const clearBtn = document.getElementById('btn-clear');

const clock = document.getElementById('dateAndTime');
// #endregion

// #region EXTRA FEATURES
const toggle = true; //Set to true to enable extra features

if (toggle) {
  enableMapFeatures();
  getLocation(); //Gets the current user location
  showPopover(); //Shows a little popover when focusing the adress input
  showMap(); //Allows the user to use the map to find an adress
}
// #endregion

// #region DIGITAL CLOCK

//Initializes the date and real-time display clock

setInterval(() => {
  clock.innerText = digitalClock();
}, 1000);


// #endregion

// #region INSTANCE MAPS
//These maps are used for individual instances, which will allow access to the instance properties and methods.
const staffMap = new Map();
const deliveryMap = new Map();
// #endregion

// #region GET USERS FROM API
window.addEventListener('load', () => {
  staffUserGet() //Here we are passing our empty map, which will be filled by the api calls
    .then((staffs) => {
      for (const staff in staffs) {
        const staffID = staff;
        const staffMember = staffs[staff];

        staffMap.set(staffID, staffMember);
        populateRow(staffTableBody, staffMember, 'staff');
      }

      enableRowSelection(staffTableBody, 'staff');
    })
    .catch((error) => {
      console.log('Something went wrong: ', error);
    });
});

// #endregion

// #region STAFF IN/OUT
outButton.addEventListener('click', function () {
  const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
  const rows = Array.from(selectedRows);

  staffOut(rows, staffMap);
});

inButton.addEventListener('click', function () {
  const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
  const rows = Array.from(selectedRows);

  staffIn(rows, staffMap);
});

// #endregion

// #region DELIVERY ADD/CLEAR

addBtn.addEventListener('click', () => {
  const VEHICLE = document.getElementById('sch-vehicle');
  const NAME = document.getElementById('sch-fname');
  const SURNAME = document.getElementById('sch-lname');
  const PHONE = document.getElementById('sch-phone');
  const ADRESS = document.getElementById('sch-adress');
  const RETURN = document.getElementById('sch-rtime');

  let vehIcon = '';

  if (VEHICLE.value === 'Car') {
    vehIcon = `<i class="fa fa-car" aria-hidden="true"></i>`;
  } else {
    vehIcon = `<i class="fa-solid fa-motorcycle"></i>`;
  }

  const inputs = {
    vehicle: vehIcon,
    name: NAME.value,
    surname: SURNAME.value,
    phone: PHONE.value,
    adress: ADRESS.value,
    expectedRTime: RETURN.value
  };

  const newDelivery = addDelivery(inputs, deliveryMap);

  //Clear the table values
  NAME.value = '';
  SURNAME.value = '';
  PHONE.value = '';
  ADRESS.value = '';
  RETURN.value = '';

  populateRow(deliveryTableBody, newDelivery, 'delivery');
  enableRowSelection(deliveryTableBody, 'delivery');
});

clearBtn.addEventListener('click', () => {
  const selectedRow = deliveryTableBody.getElementsByClassName('selectedRow');

  const rows = Array.from(selectedRow);

  clearDelivery(rows, deliveryMap);
});

// This function will allow the ENTER key to submit to Delivery Board
// Only when form inputs are selected
formEnterKeyListener();

// #endregion
