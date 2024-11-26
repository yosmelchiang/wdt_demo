import { staffUserGet, fetchAdress } from './api/wdt_api.js';
import { enableRowSelection, formEnterKeyListener } from './events/wdt_event.js';
import {
  timeStamp,
  digitalClock,
  currentTimeInMinutes,
  convertMinutesToHours,
  returnTimeFormat,
  createReturnTimeCalculator
} from './utils/wdt_time.js';
import { getRowId, getUserDuration, populateRow } from './utils/wdt_utility.js';
import { Staff } from './classes/wdt_staff.js';
import { addDelivery, validateDelivery } from './classes/wdt_delivery.js';
import { enableMapFeatures, getLocation, showMap, showPopover } from './components/wdt_map.js';

//Initializes the date and real-time display clock
setInterval(() => {
  footer.innerText = digitalClock();
}, 1000);

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

const footer = document.getElementById('dateAndTime');
// #endregion

// #region maps
//These maps are used for individual instances, which will allow access to the instance properties and methods.
export const staffMap = new Map();
export const deliveryMap = new Map();
// #endregion

// #region api fetch
window.addEventListener('load', () => {
  staffUserGet()
    .then((users) => {
      for (const user in users) {
        const mapKey = user;
        const mapObject = users[user];

        if (!staffMap.has(mapKey)) {
          const newStaff = new Staff(mapObject);
          staffMap.set(mapKey, newStaff);

          populateRow(staffTableBody, newStaff, 'staffRow');
        }
      }
      enableRowSelection(staffTableBody, 'staffRow');
    })
    .catch((error) => {
      console.log('Something went wrong: ', error);
    });
});
// #endregion

// #region IN/OUT STAFF TABLE
outButton.addEventListener('click', function () {
  const rows = staffTableBody.getElementsByClassName('selectedRow');
  const rowsArray = Array.from(rows);

  if (rowsArray.length > 0) {
    const userDuration = getUserDuration(); //Asks the user for duration and validates, returns time in minutes format

    for (let i = 0; i < rowsArray.length; i++) {
      const row = rowsArray[i];

      const outTime = timeStamp();
      const userDurationFormatted = convertMinutesToHours(userDuration); //Formats from minutes to hours, returns in HH:MM format.
      const calculateReturnTime = createReturnTimeCalculator(currentTimeInMinutes());
      const expectedRTimeFormatted = returnTimeFormat(calculateReturnTime(userDuration)); //Calculates expected Return Time, returns in HH:MM format.

      const staffID = getRowId(row);
      const staffInstance = staffMap.get(staffID);

      if (staffInstance) {
        //Updating the page with Staff instance properties for visibility
        row.cells[5].innerHTML = outTime;
        row.cells[6].innerHTML = userDurationFormatted;
        row.cells[7].innerHTML = expectedRTimeFormatted;

        //Marks staff as out and checks for lateness
        staffInstance.staffOut(row, outTime, expectedRTimeFormatted); //staffOut method sets the instance status property to Out and updated the HTML DOM element as well
      }

      //Removes the CSS class from the row after its been handled.
      row.classList.remove('selectedRow');
    }
  }
});

inButton.addEventListener('click', function () {
  const rows = staffTableBody.getElementsByClassName('selectedRow');
  const rowsArray = Array.from(rows);

  if (rowsArray.length > 0) {
    for (let i = 0; i < rowsArray.length; i++) {
      const row = rowsArray[i];

      const staffID = getRowId(row);
      const staffInstance = staffMap.get(staffID);

      if (staffInstance) {
        staffInstance.staffIn(row);
      }

      row.classList.remove('selectedRow');
    }
  }
});

// #endregion

// #region ADD/CLEAR SCHEDULE DELIVERY/DELIVERY TABLE

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

  const jsUser = {
    vehicle: vehIcon,
    name: NAME.value,
    surname: SURNAME.value,
    phone: PHONE.value,
    adress: ADRESS.value,
    expectedRTime: RETURN.value
  };

  const errorMessage = validateDelivery(jsUser);

  if (errorMessage) {
    alert(errorMessage);
    return; //This return stops the rest of the code block once message has been shown to the user
  }

  const mapKey = jsUser.name + '.' + jsUser.surname;

  if (!deliveryMap.has(mapKey)) {
    const newDelivery = addDelivery(jsUser);

    deliveryMap.set(mapKey, newDelivery);

    populateRow(deliveryTableBody, newDelivery, 'deliveryRow');
    enableRowSelection(deliveryTableBody, 'deliveryRow');

    //Clear the table values
    NAME.value = '';
    SURNAME.value = '';
    PHONE.value = '';
    ADRESS.value = '';
    RETURN.value = '';
  } else {
    alert('This user has already been added to the Delivery Board');
  }
});

clearBtn.addEventListener('click', () => {
  const rows = document.getElementsByClassName('selectedRow');

  const rowsArray = Array.from(rows);

  if (rowsArray.length > 0) {
    for (let i = 0; i < rowsArray.length; i++) {
      const row = rowsArray[i];
      const mapKey = getRowId(row);

      let warningMsg = `
      Are you sure you want to clear ${mapKey.replace('.', ' ')} from the board?
      `;
      if (confirm(warningMsg) == true) {
        deliveryMap.delete(mapKey);
        row.remove();
      }
    }
  }
});

// This function will allow the ENTER key to submit to Delivery Board
// Only when form inputs are selected
formEnterKeyListener();

// #endregion
it 
// #region EXTRA FEATURES
const toggle = true; //Set to true to enable extra features

if (toggle) {
  enableMapFeatures();
  getLocation(); //Gets the current user location
  showPopover(); //Shows a little popover when focusing the adress input
  showMap(); //Allows the user to use the map to find an adress
}

// #endregion
