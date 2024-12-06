import { fetchUserData } from './api/wdt_api.js'; // API Imports
import { factory } from './classes/wdt_factory.js'; // Factory Pattern
import { DOMInterface } from './utils/DOMInterface.js';
import { DOMLocation } from './utils/DOMLocation.js';
import { DOMUtils } from './utils/DOMUtils.js';

const WDT_APP = {
  DOM: null, // Property to store all DOM elements

  EMPLOYEES: new Map([
    ['staffs', {}],
    ['deliveries', {}],
    [
      'config',
      {
        users: 5,
        seed: 'wdtnoroff',
        lateInterval: 60000
      }
    ]
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

    //Initiating utilities and getting DOM Elements
    DOMUtils.init();

    //Creating a reference to the DOM elements to this app, so we can use them here.
    this.DOM = DOMUtils.DOM;

    //Listeners
    this.addListeners();

    //API call/fetch
    await this.staffUserGet(); //wait for users to be fetched, return a Promise and populate our JSObject.

    //create new user instances
    this.createUser(); //then we run this to create new users and populate the DOM Table

    //Start digital clock
    this.digitalClock();

    //extra features
    this.loadExtraFeatures();
  },

  digitalClock() {
    const { ui } = this.DOM,
      { clock } = ui;
    this.DigitalClock.displayTime(clock);
  },

  addListeners() {
    console.log('APP: Listeners added');

    const { staff, schedule, delivery } = this.DOM,
      { outBtn, inBtn } = staff,
      { vehicle, inputs } = schedule,
      { addBtn, clearBtn } = delivery;
    const formInputs = { vehicle, inputs };

    outBtn.addEventListener('click', () => this.staffOut());
    inBtn.addEventListener('click', () => this.staffIn());
    addBtn.addEventListener('click', () => this.addDelivery(formInputs));
    clearBtn.addEventListener('click', () => this.clearDelivery());
  },

  //Notes
  //1. Call the API > Destructure and return an Object
  //2. Use the Object to create class instances
  //3. Store each instance in the Employee map
  //4. populate DOM and enable Row selections

  async staffUserGet() {
    await fetchUserData(this.EMPLOYEES) //Fills up the 'staffs' key in the EMPLOYEES map
      .catch((error) => console.log('Something went wrong', error));
  },

  createUser() {
    for (const staff in this.staffs) {
      const newInstance = factory.createEmployee('staff', this.staffs[staff]); //Creating new class instances
      this.staffs[staff] = newInstance; //Here we are replacing the existing JSObject with Class instances in our map for OOP handling
      DOMUtils.table.populateStaff(newInstance); //Here we are populating the DOM
    }
    DOMUtils.interact.enableStaffSelection();
  },

  //Staff Management
  async staffOut() {
    const selectedRows = this.DOM.staff.sTable.getElementsByClassName('selectedRow');

    if (selectedRows.length > 0) {
      const input = await DOMInterface.prompt.getDuration();
      const rows = Array.from(selectedRows);

      for (const row of rows) {
        if (input === null) {
          row.classList.remove('selectedRow');
        } else {
          const staffID = DOMUtils.table.getRowId(row);
          const time = factory.createEmployee('time', new Date());
          const outTime = time.currentTimeInHours;
          const duration = time.convertMinsToHours(input);
          const returnTime = time.addTime(input);

          for (const staff in this.staffs) {
            if (staff === staffID) {
              const staffInstance = this.staffs[staff];
              staffInstance.staffMemberIsLate(this.EMPLOYEES);
              staffInstance.out = { row, outTime, duration, returnTime };

              DOMUtils.table.updateStaff = { row, staffInstance };
            }
          }
          row.classList.remove('selectedRow');
        }
      }
      return;
    }
    DOMInterface.toast.create('system', { message: 'Please select one or more rows and try again.'})
    // alert('Please select one or more rows and try again.');
  },

  staffIn() {
    const selectedRows = this.DOM.staff.sTable.getElementsByClassName('selectedRow');

    if (selectedRows.length > 0) {
      const rows = Array.from(selectedRows);

      for (const row of rows) {
        const staffID = DOMUtils.table.getRowId(row);

        for (const staff in this.staffs) {
          if (staff === staffID) {
            const staffInstance = this.staffs[staff];
            staffInstance.in = {}; //Need to pass a value to trigger the set accessor, so we are passing an empty object.
            DOMUtils.table.updateStaff = { row, staffInstance };
          }
        }
        row.classList.remove('selectedRow');
      }
      return;
    }
    DOMInterface.toast.create('system', { message: 'Please select one or more rows and try again.'})
    // alert('Please select one or more rows and try again.');
  },

  addDelivery(formInputs) {
    const { vehicle, inputs } = formInputs;
    const { fname, lname, phone, adress, rtime } = inputs;

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

    const errorMessage = DOMInterface.input.validate(deliveryInstance);

    if (errorMessage) {
      // alert(errorMessage);
      // const toastData = {
      //   message: errorMessage
      // }
      DOMInterface.toast.create('system', { message: errorMessage })
      // const toastInstance = factory.createEmployee('systemNotification', toastData)
      // toastInstance.Notify();
      return;
    } else if (deliveryInstance.id in this.deliveries || deliveryInstance.id in this.staffs) {
      DOMInterface.toast.create('system', { message: `${deliveryInstance.id.replace('.', ' ')} is already in the system.`})
      // alert(`${deliveryInstance.id.replace('.', ' ')} is already in the system.`);
    } else {
      this.deliveries[deliveryInstance.id] = deliveryInstance;
      deliveryInstance.deliveryDriverIsLate(this.EMPLOYEES);

      DOMUtils.table.populateDeliveries(deliveryInstance);
      DOMUtils.interact.enableDeliverySelection();

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
        const deliveryID = DOMUtils.table.getRowId(row);
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
      //Allows the user to use a map to find an adress, as well as benefit from the browser location-service.
      DOMLocation.init();

      // Allows the ENTER key to submit to Delivery Board
      DOMUtils.interact.useEnterToSubmit(this.DOM.ui.formInputs, this.DOM.delivery.addBtn); 
    }
  }
};



window.addEventListener('load', WDT_APP.init());
