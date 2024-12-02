// #region IMPORTS

import { getData } from './api/wdt_api.js'; // API Imports
import { factory } from './classes/wdt_factory.js'; // Factory Pattern
import { enableRowSelection, formEnterKeyListener } from './events/wdt_event.js'; /// Event Listeners
import { getRowId, getUserDuration, populateRow } from './utils/wdt_utility.js'; // Utilities
import { enableMapFeatures, getLocation, showMap, showPopover } from './components/wdt_map.js'; // Extra features

// #endregion

// #region APP Initializaiton

const WDT_APP = {
  DOM: {}, // Object to store all DOM elements

  EMPLOYEES: new Map([
    ['staffs', {}],
    ['deliveries', {}],
    ['config', { users: 5, seed: 'wdtnoroff', lateInterval: 60000 }]
  ]), // EMPLOYEE map, we are going to store both staff/delivery class instances in here and other useful data to be used across the app.

  DigitalClock: factory.createEmployee('time', new Date()), //Creating a date object for our Digital clock, using the Time class

  extraFeatures: true, // Set to true to enable extra features

  get staffs() {
    return this.EMPLOYEES.get('staffs');
  },

  get deliveries() {
    return this.EMPLOYEES.get('deliveries');
  },

  //Since we are fetching users from an API call we need to define this operation as async to ensure we get a response from our call before we try to retrieve our JSOBject.
  async init() {
    console.log('Initializing app...');
    //DOM Elements
    this.getDOMElements();

    //Storing these specific elements to our Employee map
    this.EMPLOYEES.set('DOM Elements', {
      toastContainer: this.DOM.ui.toastContainer, //This container is being passed to and being used by the staff class to create notifications
      staffTableBody: this.DOM.staff.sTable,
      deliveryTableBody: this.DOM.delivery.dTable
    });

    //Start digital clock
    this.digitalClock();

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
      { addBtn, clearBtn } = delivery;
    const formInputs = { vehicle, inputs };

    outBtn.addEventListener('click', () => this.staffOut(sTable));
    inBtn.addEventListener('click', () => this.staffIn(sTable));
    addBtn.addEventListener('click', () => this.addDelivery(formInputs));
    clearBtn.addEventListener('click', () => this.clearDelivery());
  },

  //Notes
  //1. Call the API > Destructure and return an Object
  //2. Use the Object to create class instances
  //3. Store each instance in the Employee map
  //4. populate DOM and enable Row selections

  async staffUserGet() {
    await getData(this.EMPLOYEES) //Fills up the 'staffs' key in the EMPLOYEES map
      .catch((error) => console.log('Something went wrong', error));
  },

  createUser() {
    const { staff } = this.DOM,
      { sTable } = staff;

    for (const staff in this.staffs) {
      const newInstance = factory.createEmployee('staff', this.staffs[staff]); //Creating new class instances
      this.staffs[staff] = newInstance; //Here we are replacing the existing JSObject with Class instances in our map for OOP handling
      populateRow(sTable, newInstance, 'staff'); //Populating the DOM table with the new instances
    }
    enableRowSelection(sTable, 'staff');
  },

  //Staff Management
  staffOut(sTable) {
    const selectedRows = sTable.getElementsByClassName('selectedRow');

    if (selectedRows.length > 0) {
      const input = getUserDuration();
      const rows = Array.from(selectedRows);

      for (const row of rows) {
        if (input === null) {
          row.classList.remove('selectedRow');
        } else {
          const staffID = getRowId(row);
          const time = factory.createEmployee('time', new Date());
          const outTime = time.currentTimeInHours();
          const duration = time.convertMinsToHours(input);
          const returnTime = time.addTime(input);

          for (const staff in this.staffs) {
            if (staff === staffID) {
              const staffInstance = this.staffs[staff];

              staffInstance.out(row, outTime, duration, returnTime);
              staffInstance.staffMemberIsLate(this.EMPLOYEES);
            }
          }
          row.classList.remove('selectedRow');
        }
      }
      return;
    }
    alert('Please select one or more rows and try again.');
  },

  staffIn(sTable) {
    const selectedRows = sTable.getElementsByClassName('selectedRow');

    if (selectedRows.length > 0) {
      const rows = Array.from(selectedRows);

      for (const row of rows) {
        const staffID = getRowId(row);

        for (const staff in this.staffs) {
          if (staff === staffID) {
            const staffInstance = this.staffs[staff];
            staffInstance.in(row);
          }
        }
        row.classList.remove('selectedRow');
      }
      return;
    }
    alert('Please select one or more rows and try again.');
  },

  //Delivery Management
  validate(form) {
    const { name, surname, phone, adress, expectedRTime } = form;
    let errorMessage = '';

    const time = factory.createEmployee('time', new Date());
    const inputTime = time.convertHoursToMins(expectedRTime);
    const currentTime = time.currentTimeInMins();

    const invalidName = name.trim() === '' || !isNaN(name);
    const invalidSurname = surname.trim() === '' || !isNaN(surname);
    const invalidPhone = phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
    const invalidAdress = adress.trim() === '';
    const invalidReturnTime = expectedRTime.trim() === '' || inputTime < currentTime;

    if (invalidName) {
      errorMessage = 'Name cannot be a number or empty.';
    } else if (invalidSurname) {
      errorMessage = 'Surname cannot be a number or empty.';
    } else if (invalidPhone) {
      errorMessage = 'Phone cannot be empty.';
    } else if (invalidAdress) {
      errorMessage = 'Adress cannot be empty';
    } else if (invalidReturnTime) {
      errorMessage = 'Return time cannot back in time or empty';
    }

    return errorMessage;
  },

  addDelivery(formInputs) {
    const { vehicle, inputs } = formInputs;
    const { fname, lname, phone, adress, rtime } = inputs;
    const dTable = this.DOM.delivery.dTable;

    const vehIcon =
      vehicle.value === 'Car'
        ? `<i class="fa fa-car" aria-hidden="true"></i>`
        : `<i class="fa-solid fa-motorcycle"></i>`;

    const deliveryInstance = factory.createEmployee('delivery', {
      vehicle: vehIcon,
      name: fname.value,
      surname: lname.value,
      phone: phone.value,
      adress: adress.value,
      expectedRTime: rtime.value
    });

    const errorMessage = this.validate(deliveryInstance);
    // const instance = this.deliveries;
    if (errorMessage) {
      alert(errorMessage);
      return;
    } else if (deliveryInstance.id in this.deliveries) {
      alert('This user already exists');
    } else {
      this.deliveries[deliveryInstance.id] = deliveryInstance;
      deliveryInstance.deliveryDriverIsLate(this.EMPLOYEES);

      populateRow(dTable, deliveryInstance, 'delivery');
      enableRowSelection(dTable, 'delivery');

      //Clear the table values
      for (const fields of inputs) {
        fields.value = '';
      }
    }
  },

  clearDelivery() {
    const selectedRows = this.DOM.delivery.dTable.getElementsByClassName('selectedRow');
    if (selectedRows.length > 0) {
      const rows = Array.from(selectedRows);
      for (const row of rows) {
        const deliveryID = getRowId(row);
        let message = `Are you sure you want to clear ${deliveryID.replace(
          '.',
          ' '
        )} from the board?`;
        if (confirm(message)) {
          if (deliveryID in this.deliveries) {
            delete this.deliveries[deliveryID];
            row.remove();
            row.classList.remove('selectedRow');
          }
        }
      }
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
