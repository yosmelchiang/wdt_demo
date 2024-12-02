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

  STAFFUSERS: {}, //Empty object, we are going to be filling this up with users from the api call.
  DELIVERUSERS: {}, //Empty object, we are going to be filling this up with deliveries from manual input.
  EMPLOYEES: new Map(), // Empty map, we are going to store both staff/delivery class instances in here and other useful data.

  SETTINGS: {
    userAmount: 5, //Amount of users get are getting from the randomuser API.
    lateInterval: 1000 //Interval configuration for checking late employees. Set to 1 min
  },

  DigitalClock: factory.createEmployee('time', new Date()), //Creating a date object for our Digital clock, using the Time class

  extraFeatures: true, // Set to true to enable extra features

  //Since we are fetching users from an API call we need to define this operation as async to ensure we get a response from our call before we try to retrieve our JSOBject.
  async init() {
    //DOM Elements
    this.getDOMElements();

    //Start digital clock
    this.digitalClock();

    //Create Map
    this.EMPLOYEES.set('DOM Elements', {
      toastContainer: this.DOM.ui.toastContainer, //This container is being passed to and being used by the staff class to create notifications
      staffTableBody: this.DOM.staff.sTable,
      deliveryTableBody: this.DOM.delivery.dTable
    });

    this.EMPLOYEES.set('Settings', {
      lateInterval: this.SETTINGS.lateInterval
    });

    //Listeners
    this.addListeners();

    //api call/fetch
    await this.staffUserGet(); //wait for users to be fetched, return a Promise and populate our JSObject.

    //create new user instances
    this.createUser(); //then we run this to create new users and populate the DOM Table

    //extra features
    this.loadExtraFeatures();
  },

  getDOMElements() {
    console.log('DOM elements loaded');

    this.DOM = {
      staff: {
        sTable: document.getElementById('staff').getElementsByTagName('tbody')[0],
        inBtn: document.getElementById('btn-in'),
        outBtn: document.getElementById('btn-out')
      },

      schedule: {
        vehicle: document.getElementById('schedule').getElementsByTagName('select'),
        inputs: document.getElementById('schedule').getElementsByTagName('input')
      },

      delivery: {
        dTable: document.getElementById('delivery').getElementsByTagName('tbody')[0],
        addBtn: document.getElementById('btn-add'),
        clearBtn: document.getElementById('btn-clear')
      },

      ui: {
        clock: document.getElementById('dateAndTime'),
        toastContainer: document.getElementsByClassName('toast-container')[0]
      }
    };
  },

  digitalClock() {
    const { ui } = this.DOM,
      { clock } = ui;
    this.DigitalClock.displayTime(clock);
  },

  addListeners() {
    console.log('Listeners added');

    const { staff, schedule, delivery } = this.DOM,
      { outBtn, inBtn, sTable } = staff,
      { vehicle, inputs } = schedule,
      { dTable, addBtn, clearBtn } = delivery;

    outBtn.addEventListener('click', () => {
      const selectedRows = sTable.getElementsByClassName('selectedRow');
      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        staffOut(rows, this.EMPLOYEES);
        return;
      }
      alert("You haven't selected any rows, please select one or more rows and try again.");
    });

    inBtn.addEventListener('click', () => {
      const selectedRows = sTable.getElementsByClassName('selectedRow');
      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        staffIn(rows, this.EMPLOYEES);
        return;
      }
      alert("You haven't selected any rows, please select one or more rows and try again.");
    });

    addBtn.addEventListener('click', () => {
      const { fname, lname, phone, adress, rtime } = inputs;

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
      for (const fields of inputs) {
        fields.value = '';
      }
    });

    clearBtn.addEventListener('click', () => {
      const selectedRow = dTable.getElementsByClassName('selectedRow');

      const rows = Array.from(selectedRow);

      clearDelivery(rows, this.EMPLOYEES);
    });
  },

  //Notes
  //1. Call the API > Destructure and return an JSObject
  //2. Use the Object to create class instances
  //3. Store each instance in the Employee map
  //4. populate DOM and enable Row selections

  
  async staffUserGet() {

    await getData(this.STAFFUSERS) //We are passing our empty object to the API call to fill it up with users.
    .then((results) => {
      console.log('JSOBject created and stored in STAFFUSERS')
      this.STAFFUSERS = results; // IF call was successful, we should be able to access these users now.
    })
    .catch(error => console.log('Something went wrong', error))
  
  },
  
  createUser() {
    const { staff } = this.DOM, { sTable } = staff;
    for(const item in this.STAFFUSERS) {
      const staff = factory.createEmployee('staff', this.STAFFUSERS[item]);
      const staffID = item
      this.EMPLOYEES.set(staffID, staff)

      //Update the DOM Staff table with newly created usres
      populateRow(sTable, staff, 'staff')
      enableRowSelection(sTable, 'staff')
    }
  },

  loadExtraFeatures() {
    if (this.extraFeatures) {
      console.log('Extra features loaded');
      enableMapFeatures(); //This function simply hides/shows current location and map icons from the DOM
      getLocation(); //Gets the current user location
      showPopover(); //Shows a little popover when focusing the adress input
      showMap(); //Allows the user to use the map to find an adress
      formEnterKeyListener(this.DOM.delivery.addBtn); // This function will allow the ENTER key to submit to Delivery Board
    }
  }
};

window.addEventListener('load', WDT_APP.init());
// #endregion
