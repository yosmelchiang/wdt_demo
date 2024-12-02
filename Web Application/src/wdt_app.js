// #region IMPORTS

// API Imports
import { getData } from './api/wdt_api.js';

// Factory Pattern
import { factory } from './classes/wdt_factory.js';

/// Event Listeners
import { enableRowSelection, formEnterKeyListener } from './events/wdt_event.js';

// Components
import { enableMapFeatures, getLocation, showMap, showPopover } from './components/wdt_map.js';

// Classes
import { staffIn, staffOut } from './classes/wdt_staff.js';
import { addDelivery, clearDelivery } from './classes/wdt_delivery.js';
import { populateRow } from './utils/wdt_utility.js';

// #endregion

// #region APP Initializaiton

const WDT_APP = {
  DOM: {}, // Object to store all DOM elements
  EMPLOYEES: new Map(), // Store users and DOM elements
  DigitalClock: factory.createEmployee('time', new Date()), //Creating a date object for our Digital clock, using the Time class
  extraFeatures: true, // Set to true to enable extra features

  init() {
    //DOM Elements
    this.getDOMElements();

    //Start digital clock
    this.digitalClock();

    //Create Map
    this.EMPLOYEES.set('DOM Elements', {
      toastContainer: this.DOM.toastContainer,
      staffTableBody: this.DOM.staffTableBody,
      deliveryTableBody: this.DOM.deliveryTableBody
    });

    //AddListeners
    this.addListeners();

    //api fetch
    this.staffUserGet();

    //extra features
    this.eanbleExtraFeatures();
  },

  getDOMElements() {
    console.log('DOM elements loaded');

    this.DOM = {
      staffTable: document.getElementById('staff'), //Main table of staff members
      staffTableBody: document.getElementById('staff').getElementsByTagName('tbody')[0],
      inButton: document.getElementById('btn-in'),
      outButton: document.getElementById('btn-out'),
      scheduleDelivery: document.getElementById('schedule'),
      scheduleVehicle: document.getElementById('schedule').getElementsByTagName('select'),
      scheduleInputs: document.getElementById('schedule').getElementsByTagName('input'),
      deliveryTable: document.getElementById('delivery'),
      deliveryTableBody: document.getElementById('delivery').getElementsByTagName('tbody')[0],
      addBtn: document.getElementById('btn-add'),
      clearBtn: document.getElementById('btn-clear'),
      clock: document.getElementById('dateAndTime'),
      toastContainer: document.getElementsByClassName('toast-container')[0]
    };
  },

  digitalClock() {
    console.log('digitalClock started');
    this.DigitalClock.displayTime(this.DOM.clock);
  },

  addListeners() {
    console.log('Listeners added');

    const {
      inButton,
      outButton,
      addBtn,
      clearBtn,
      staffTableBody,
      deliveryTableBody,
      scheduleVehicle,
      scheduleInputs
    } = this.DOM;

    outButton.addEventListener('click', () => {
      const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        staffOut(rows, this.EMPLOYEES);
        return;
      }
      alert("You haven't selected any rows, please select one or more rows and try again.");
    });

    inButton.addEventListener('click', () => {
      const selectedRows = staffTableBody.getElementsByClassName('selectedRow');
      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        staffIn(rows, this.EMPLOYEES);
        return;
      }
      alert("You haven't selected any rows, please select one or more rows and try again.");
    });

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
        this.EMPLOYEES
      );

      //Clear the table values
      for (const inputs of scheduleInputs) {
        inputs.value = '';
      }
    });

    clearBtn.addEventListener('click', () => {
      const selectedRow = deliveryTableBody.getElementsByClassName('selectedRow');

      const rows = Array.from(selectedRow);

      clearDelivery(rows, this.EMPLOYEES);
    });
  },

  staffUserGet() {
    getData()
      .then((staffs) => {
        const { staffTableBody } = this.DOM;

        for (const staff in staffs) {
          const staffID = staff;
          const staffMember = staffs[staff];

          this.EMPLOYEES.set(staffID, staffMember);
          populateRow(staffTableBody, staffMember, 'staff');
        }
        enableRowSelection(staffTableBody, 'staff');
        console.log('Users fully fetched');
      })
      .catch((error) => console.log('Something went wrong', error));
  },

  eanbleExtraFeatures() {
    if (this.extraFeatures) {
      console.log('Extra features enabled');
      enableMapFeatures(); //This function simply hides/shows current location and map icons from the DOM
      getLocation(); //Gets the current user location
      showPopover(); //Shows a little popover when focusing the adress input
      showMap(); //Allows the user to use the map to find an adress
      formEnterKeyListener(this.DOM.addBtn); // This function will allow the ENTER key to submit to Delivery Board
    }
  }
};

window.addEventListener('load', () => WDT_APP.init());
// #endregion
