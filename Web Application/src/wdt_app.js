import { fetchUserData } from './api/wdt_api.js'; // API Imports
import { factory } from './classes/wdt_factory.js'; // Factory Pattern
import { DOMInterface } from './utils/DOMInterface.js';
import { DOMLocation } from './utils/DOMLocation.js';
import { DOMUtils } from './utils/DOMUtils.js';

const WDT_APP = {
  //Properties

  DOM: null, // Property to store all DOM elements
  extraFeatures: true, // Set to true to enable extra features

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

  api: {
    //Notes
    //1. Call the API > Destructure and return an Object
    //2. Use the Object to create class instances
    //3. Store each instance in the Employee map
    //4. populate DOM and enable Row selections

    async staffUserGet() {
      await fetchUserData(WDT_APP.EMPLOYEES) //Fills up the 'staffs' key in the EMPLOYEES map
        .catch((error) => console.log('Something went wrong', error));
    },

    createUser() {
      for (const staff in WDT_APP.staffs) {
        const newInstance = factory.createEmployee('staff', WDT_APP.staffs[staff]); //Creating new class instances
        WDT_APP.staffs[staff] = newInstance; //Here we are replacing the existing JSObject with Class instances in our map for OOP handling
        DOMUtils.table.populateStaff(newInstance); //Here we are populating the DOM
      }
      DOMUtils.interact.enableStaffSelection();
    }
  },

  //Staff Management
  staff: {
    async staffOut() {
      const { systemToast } = WDT_APP.utils,
        selectedRows = WDT_APP.DOM.staff.sTable.getElementsByClassName('selectedRow');

      if (selectedRows.length > 0) {
        const input = await DOMInterface.prompt.getDuration();
        const rows = Array.from(selectedRows);

        for (const row of rows) {
          if (input === null) {
            row.classList.remove('selectedRow');
          } else {
            this.markAsOut(row, input);
            row.classList.remove('selectedRow');
          }
        }
        return;
      }
      systemToast('Please select one or more rows and try again.');
    },

    markAsOut(row, input) {
      const staffID = DOMUtils.table.getRowId(row),
        dateObject = new Date(),
        time = factory.createTime('time', dateObject),
        displayTime = factory.createTime('display', dateObject),
        convertTime = factory.createTime('convert', dateObject),
        
        outTime = displayTime.currentTimeInHours,
        duration = convertTime.convertMinsToHours(input),
        returnTime = time.addTime(input),
        
        { staffs, EMPLOYEES } = WDT_APP;

      for (const staff in staffs) {
        if (staff === staffID) {
          const staffInstance = staffs[staff];
          staffInstance.staffMemberIsLate(EMPLOYEES);
          staffInstance.out = { row, outTime, duration, returnTime };

          DOMUtils.table.updateStaff = { row, staffInstance };
        }
      }
    },

    staffIn() {
      const { systemToast } = WDT_APP.utils,
        selectedRows = WDT_APP.DOM.staff.sTable.getElementsByClassName('selectedRow');

      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);

        for (const row of rows) {
          this.markAsIn(row);
          row.classList.remove('selectedRow');
        }
        return;
      }
      systemToast('Please select one or more rows and try again.');
    },

    markAsIn(row) {
      const staffID = DOMUtils.table.getRowId(row),
        { staffs } = WDT_APP;

      for (const staff in staffs) {
        if (staff === staffID) {
          const staffInstance = staffs[staff];
          staffInstance.in = {}; //Need to pass a value to trigger the set accessor, so we are passing an empty object.
          DOMUtils.table.updateStaff = { row, staffInstance };
        }
      }
    }
  },

  //Delivery Management
  delivery: {
    addDelivery(formInputs) {
      const { vehicle, inputs } = formInputs,
        { fname, lname, phone, adress, rtime } = inputs,
        { staffs, deliveries, EMPLOYEES } = WDT_APP,
        { systemToast } = WDT_APP.utils,
        { populateDeliveries } = DOMUtils.table,
        { enableDeliverySelection } = DOMUtils.interact,
        { validate } = DOMInterface.input,
        vehIcon =
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

      const errorMessage = validate(deliveryInstance);

      if (errorMessage) {
        systemToast(errorMessage);
      } else if (deliveryInstance.id in deliveries || deliveryInstance.id in staffs) {
        systemToast(`${deliveryInstance.id.replace('.', ' ')} is already in the system.`);
      } else {
        deliveries[deliveryInstance.id] = deliveryInstance;
        deliveryInstance.deliveryDriverIsLate(EMPLOYEES);

        populateDeliveries(deliveryInstance);
        enableDeliverySelection();

        //Clear the table values
        for (const fields of inputs) {
          fields.value = '';
        }
      }
    },

    clearDelivery() {
      const selectedRows = WDT_APP.DOM.delivery.dTable.getElementsByClassName('selectedRow'),
        { getRowId } = DOMUtils.table,
        { deliveries } = WDT_APP;

      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        for (const row of rows) {
          const deliveryID = getRowId(row);
          let message = `Are you sure you want to clear ${deliveryID.replace(
            '.',
            ' '
          )} from the board?`;
          if (confirm(message)) {
            if (deliveryID in deliveries) {
              delete deliveries[deliveryID];
              row.remove();
              row.classList.remove('selectedRow');
            }
          }
        }
      }
    }
  },

  //Gettters
  get staffs() {
    return this.EMPLOYEES.get('staffs');
  },

  get deliveries() {
    return this.EMPLOYEES.get('deliveries');
  },

  utils: {
    addListeners() {
      console.log('APP: Listeners added');

      const { staff, schedule, delivery } = WDT_APP.DOM,
        { outBtn, inBtn } = staff,
        { vehicle, inputs } = schedule,
        { addBtn, clearBtn } = delivery,
        formInputs = { vehicle, inputs };

      outBtn.addEventListener('click', () => WDT_APP.staff.staffOut());
      inBtn.addEventListener('click', () => WDT_APP.staff.staffIn());
      addBtn.addEventListener('click', () => WDT_APP.delivery.addDelivery(formInputs));
      clearBtn.addEventListener('click', () => WDT_APP.delivery.clearDelivery());
    },

    digitalClock() {
      const DigitalClock = factory.createTime('display', new Date()),
        { ui } = WDT_APP.DOM,
        { clock } = ui;

      DigitalClock.displayTime(clock);
    },

    systemToast(content) {
      const { create } = DOMInterface.toast;

      create('system', {
        message: content
      });
    },

    loadExtraFeatures() {
      const { extraFeatures, DOM } = WDT_APP,
        { formInputs } = WDT_APP.DOM.ui,
        { addBtn } = DOM.delivery,
        { useEnterToSubmit } = DOMUtils.interact;

      if (extraFeatures) {
        //Allows the user to use a map to find an adress, as well as benefit from the browser location-service.
        DOMLocation.init();

        // Allows the ENTER key to submit to Delivery Board
        useEnterToSubmit(formInputs, addBtn);
      }
    }
  },

  //Methods
  //Since we are fetching users from an API call we need to define this operation as async to ensure we get a response from our call before we try to retrieve our JSOBject.
  async init() {
    console.log('Initializing app...');

    const { digitalClock, addListeners, loadExtraFeatures } = WDT_APP.utils,
      { createUser } = WDT_APP.api;

    //Initiating utilities and getting DOM Elements
    DOMUtils.init();

    //Creating a reference to the DOM elements to this app, so we can use them here.
    this.DOM = DOMUtils.DOM;

    //Listeners
    addListeners();

    //API call/fetch
    await this.api.staffUserGet(); //wait for users to be fetched, return a Promise and populate our JSObject.

    //create new user instances
    createUser(); //then we run this to create new users and populate the DOM Table

    //Start digital clock
    digitalClock();

    //extra features
    loadExtraFeatures();
  }
};

window.addEventListener('load', WDT_APP.init());
