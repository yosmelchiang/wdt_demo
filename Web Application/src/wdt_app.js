import { fetchUserData } from './api/wdt_api.js'; // API Imports
import { factory } from './classes/wdt_factory.js'; // Factory Pattern
import { DOMInterface } from './utils/DOMInterface.js'; // UI Related utilities, such as toasts and prompts
import { DOMLocation } from './utils/DOMLocation.js'; // Location-service related utilities, such as Leaflet map and Reverse GeoSearch API
import { DOMUtils } from './utils/DOMUtils.js'; // Main DOM utilities where we fetch DOM elements as well as handle table operations.

/**
 * Main entry point object for our application
 */
const WDT_APP = {
  //Properties
  DOM: null, // Property to store all DOM elements used in this script once they have been retrieved from /DOMUtils.js
  extraFeatures: true, // Set to true to enable extra features, these functions are helper functions to enhance user experience.

  // EMPLOYEE map, we are going to store both staff/delivery class instances in here and other useful data to be used across the app.
  EMPLOYEES: new Map([
    ['staffs', {}],
    ['deliveries', {}],
    [
      'config', // Configuration data used for API call as well as employee instance functionality.
      {
        users: 5,
        seed: 'wdtnoroff',
        lateInterval: 60000
      }
    ]
  ]),

  /**
   * Our api property handles the creation of 5 unique users for our Staff Management functionality, the steps are the following:
   * 1. Call the API > Destructure and return an Object.
   * 2. Use the Object to create class instances.
   * 3. Store each instance in the Employee map.
   * 4. Populate DOM and enable row selection.
   */
  api: {
    // This is a function that takes time (async)
    async staffUserGet() {
      await fetchUserData(WDT_APP.EMPLOYEES) // Here we are passing our Map to fetchUserDAta and waiting for it to fill up the 'staffs' key with users.
        .catch((error) => console.log('Something went wrong', error));
    },

    // After staffUserGet is done fetching users, the next step is now to create instances and replace the existing object with an instance we can work with in code.
    createUserInstance() {
      const { staffs } = WDT_APP,
        { interact, table } = DOMUtils,
        { populateStaffTable } = table,
        { enableStaffSelection } = interact;

      for (const staff in staffs) {
        const newInstance = factory.createEmployee('staff', staffs[staff]); //Creating new class instance
        staffs[staff] = newInstance; //Here we are replacing the existing JSObject with Class instances in our map for OOP handling
        populateStaffTable(newInstance); //Here we are populating the DOM
      }
      enableStaffSelection();
    }
  },

  /**
   * Our staff property handles Staff operations such as clocking a staff in/out, for each action, the steps are the following:
   * 1. We want to make sure one or more rows are selected, if they are, then we prompt the user for a duration.
   * 2. Once the user has given an absence time and everything is validated, we make sure to clear the rows of the selectedRow class.
   * 3. If no rows are selected, we trigger a toast notification letting the user know to select one or more rows first.
   */
  staff: {
    async staffOut() {
      // Destructuring
      const { systemToast } = WDT_APP.utils,
        { sTable } = WDT_APP.DOM.staff,
        selectedRows = sTable.getElementsByClassName('selectedRow');

      //Making sure the HTML collection object has at least 1 row with the class name 'selectedRow'
      if (selectedRows.length > 0) {
        const input = await DOMInterface.prompt.getDuration();
        const rows = Array.from(selectedRows); //We are creating an array out of HTML Collectiong object to make it easier for us to iterate

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

    /**
     * This is a helper function we are using to initiate instance related operations such as staffMemberIsLate but also update the staff table.
     * @param {Element} row - Row element to update
     * @param {Number} input - Absence duration
     */
    markAsOut(row, input) {
      // Declaring variables used when updating the instance as 'Out'
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
          //We are using the Name.Surname values of the row as an idenifier, here we are checking if the row id and instance ID matches.
          const staffInstance = staffs[staff]; //Here we are retrieving the instance from our key 'staffs' in EMPLOYEE map, by the ID Name.Surname.

          // Instance method
          staffInstance.staffMemberIsLate(EMPLOYEES); //We are activating the notification interval to trigger once the Staff becomes late.

          // Setters, used to update HTML cells, and instance related properties.
          staffInstance.out = { row, outTime, duration, returnTime };
          DOMUtils.table.updateStaff = { row, staffInstance };
        }
      }
    },

    staffIn() {
      const { systemToast } = WDT_APP.utils,
        { sTable } = WDT_APP.DOM.staff,
        selectedRows = sTable.getElementsByClassName('selectedRow');

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

  /**
   * Our Delivery Management system covers operations such as adding and clearing deliveries.
   * 1. Once the add button is clicked, we are validating each input field individually.
   * 2. Validation: FName/LName should not be numbers or empty, Phone should be a number but not empty, adress can be numbers or words but not empty, return time can not be back in time or empty.
   * 3. Car / Motorcycle icon is assigned to vehIcon.
   */
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

      //For our validation, we are going to craft a message to provide the user with a visual feedback.
      const errorMessage = validate(deliveryInstance);

      if (errorMessage) {
        systemToast(errorMessage);
      } else if (deliveryInstance.id in deliveries) {
        // Here we are checking if the Delivery already exists in Delivery Board.
        systemToast(
          `${deliveryInstance.id.replace('.', ' ')} already exists in the Delivery Board.`
        );
      } else if (deliveryInstance.id in staffs) {
        // Here we are checking if the Delivery already exists as a user in the Staff Board.
        systemToast(`${deliveryInstance.id.replace('.', ' ')} already exists in the Staff Board.`);
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
      const { dTable } = WDT_APP.DOM.delivery,
        selectedRows = dTable.getElementsByClassName('selectedRow'),
        { getRowId } = DOMUtils.table,
        { deliveries } = WDT_APP;

      if (selectedRows.length > 0) {
        const rows = Array.from(selectedRows);
        for (const row of rows) {
          const deliveryID = getRowId(row),
            clearMessage = `Are you sure you want to clear ${deliveryID.replace(
              '.',
              ' '
            )} from the board?`;

          // We are prompting the user with a confirm box with YES/NO options to confirm clearing of deliveries.
          if (confirm(clearMessage)) {
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

  //Gettters - We are defining these to simplify syntax as they are used quite a lot throughout this code.
  get staffs() {
    return this.EMPLOYEES.get('staffs');
  },

  get deliveries() {
    return this.EMPLOYEES.get('deliveries');
  },

  /**
   * Out utils property houses listeners, the digital clock, simplified toast creation syntax for system toasts, and some extra features
   *
   */
  utils: {
    // Core functionality listeners, these are the first elements a user sees when the page loads, therefore we load them first:
    addListeners() {
      console.log('WDT_APP: Listeners added');

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

    // Digital clock, shown at the bottom of the page, uses a Class instance with the new Date() object for wider options of time display methods as well as time conversions.
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
  /**
   * This method initializes our app, after the entire window including dependent resources like images and stylesheets has fully loaded.
   * The init function performs the following tasks:
   * Logs "Initializing app..." to the console.
   * Retrieves and initializes DOM elements via DOMUtils.init().
   * Sets the this DOM property to the fetched DOM elements.
   * Adds event listeners for user interaction (e.g., button clicks for staff and delivery management).
   * Makes an asynchronous API call (staffUserGet) to fetch user data and populate the staffs key in the EMPLOYEES map.
   * Creates new user instances using the factory pattern and populates the DOM with these instances.
   * Starts a digital clock on the page.
   * Loads extra features (e.g., browser location services and using the Enter key to submit forms).
   *
   * Since we are fetching users from an API call we need to define this operation as async to ensure we get a response from our call before we try to retrieve our JSOBject.
   */
  async init() {
    console.log('Initializing app...');

    const { digitalClock, addListeners, loadExtraFeatures } = WDT_APP.utils,
      { createUserInstance } = WDT_APP.api;

    //Initiating utilities and getting DOM Elements
    DOMUtils.init();

    //Creating a reference to the DOM elements to this app, so we can use them here.
    this.DOM = DOMUtils.DOM;

    //Listeners
    addListeners();

    //API call/fetch
    await this.api.staffUserGet(); //wait for users to be fetched, return a Promise and populate our JSObject.

    //create new user instances
    createUserInstance(); //then we run this to create new users and populate the DOM Table

    //Starts our digital clock
    digitalClock();

    //extra features
    loadExtraFeatures();
  }
};

//Only running essential core elements when the window has fully loaded
//We are using an arrow function here, because our init method is using this context inside.
window.addEventListener('load', () => WDT_APP.init());
