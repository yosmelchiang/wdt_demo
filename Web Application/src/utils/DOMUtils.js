export const DOMUtils = {
  //Properties
  DOM: null,

  //GET DOM elements and check that they are successfully loaded.
  init() {
    this.DOM = this.get.DOMElements;

    const DOMloaded =
      Object.keys(this.DOM).length > 0
        ? 'DOM: Elements successfully loaded'
        : 'Error while loading DOM elements';

    console.log(DOMloaded);
  },

  get: {
    get DOMElements() {
      return {
        staff: {
          sTable: document.getElementById('staff').getElementsByTagName('tbody')[0],
          inBtn: document.getElementById('btn-in'),
          outBtn: document.getElementById('btn-out')
        },

        schedule: {
          vehicle: document.getElementById('schedule').getElementsByTagName('select')[0],
          inputs: document.getElementById('schedule').getElementsByTagName('input')
        },

        delivery: {
          dTable: document.getElementById('delivery').getElementsByTagName('tbody')[0],
          addBtn: document.getElementById('btn-add'),
          clearBtn: document.getElementById('btn-clear')
        },

        ui: {
          clock: document.getElementById('dateAndTime'),
          employeeToastContainer: document.getElementsByClassName('employee-toast-container')[0],
          systemToastContainer: document.getElementsByClassName('system-toast-container')[0],
          formInputs: document.querySelectorAll('#schedule input'),
          promptContainer: document.getElementById('customPrompt'),
          promptSubmit: document.getElementById('modalSubmit'),
          promptCancel: document.getElementById('modalCancel'),
          promptField: document.getElementById('modalInput'),
          promptBody: document.getElementById('modalBody')
        }
      };
    }
  },

  create: {
    get div() {
      return document.createElement('div');
    },

    get row() {
      return document.createElement('tr');
    }
  },

  interact: {
    //This function adds an event listener to rows of the Staff Table, that toggles a class on click, this class is used for visual feedback but also for clocking in/out functionality on instances.
    enableStaffSelection() {
      const { sTable } = DOMUtils.get.DOMElements.staff,
        rows = sTable.getElementsByTagName('tr');
      for (const row of rows) {
        row.addEventListener('click', function () {
          this.classList.toggle('selectedRow');
        });
      }
    },

    // This function adds an event listener to rows of the Dellivery Table, that toggles a class on click, this class is used for visual feedback but also for clocking in/out functionality on instances.
    // We went a little further on this function compared to the staff one because rows are added dynamically here, while on the staff table they are added once.
    // This made it a bit challenging for us, so to ensure new rows have the click listener, we check for an additional attribute of deliveryRow, if it doesnt have it, then we add it and add a listener with the class toggle
    // This added another layer of security as well, since we now are using the same class name 'selectedRow' for both staffs and delivery rows, but since the delivery rows have a second attribute we are checking for, we are safe that we dont conflict those two.
    enableDeliverySelection() {
      const { dTable } = DOMUtils.get.DOMElements.delivery,
        rows = dTable.getElementsByTagName('tr');
      for (const row of rows) {
        const isDelivery = row.hasAttribute('deliveryRow'); //New rows wont have this attribute, so we set it
        if (!isDelivery) {
          //Should be false, meaning we enter this code block
          row.addEventListener('click', function () {
            //a newly created row as been clicked, so we add the class to it
            this.classList.toggle('selectedRow');
          });
        }
        row.setAttribute('deliveryRow', 'true');
      }
    },

    /**
     * @description - We have added this function as an additional feature, to allow the user to use the enter key as an option to submit entires.
     * @param {Element} input - HTML element of input type
     * @param {Element} submitBtn - HTML element of the button we are going to click to submit, it might be a YES, or Submit, or Add type of button.
     */
    useEnterToSubmit(input, submitBtn) {
      if (Object.keys(input).length > 0) {
        // Allows the listener to be added to mulitple inputs
        for (const field of input) {
          field.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              submitBtn.click();
            }
          });
        }
      } else {
        input.addEventListener('keydown', (event) => {
          // Add a listener to only one input
          if (event.key === 'Enter') {
            submitBtn.click();
          }
        });
      }
    }
  },

  table: {
    //Setters

    /**
     * Updated the staff table
     * We are declaring values with the instance properties in an array based on instance status.
     * We are then iterating through each row cells with each of the arrays index and updating the innerHTML content.
     */
    set updateStaff(JSObject) {
      const { row, staffInstance } = JSObject;
      const { status, outTime, duration, expectedRTime } = staffInstance;
      const values =
        status === 'Out' ? [status, outTime, duration, expectedRTime] : [status, '', '', ''];

      for (const item in values) {
        row.cells[parseInt(item) + 4].innerHTML = values[item];
      }
    },

    /**
     * @description - This function is used to generate an ID based on a selected table row.
     * @param {Element} row - Table row
     * @returns Returns a concatenated string based on cell 1 and 2 of the given row.
     */
    getRowId(row) {
      const name = row.getElementsByTagName('td')[1].innerText;
      const surname = row.getElementsByTagName('td')[2].innerText;
      return name + '.' + surname;
    },

    /**
     * @description - Populates the Staff Table DOM elements with values from a Class Instance
     * @param {Class} instance - Class instance of the Staff Type
     */
    populateStaffTable(instance) {
      const { picture, name, surname, email, status, outTime, duration, expectedRTime } = instance;
      const sTable = DOMUtils.get.DOMElements.staff.sTable;
      const row = DOMUtils.create.row;

      if (instance !== undefined) {
        row.innerHTML = `
      <td><img src="${picture}" alt="Staff Picture"></td>
      <td>${name}</td>
      <td>${surname}</td>
      <td>${email}</td>
      <td>${status}</td>
      <td>${outTime}</td>
      <td>${duration}</td>
      <td>${expectedRTime}</td>      
        `;
      }
      sTable.appendChild(row);
    },

    /**
     * @description - Populates the Delivery Board DOM elements with values from a Class Instance
     * @param {Class} instance - Class instance of the Delivery Type
     */
    populateDeliveries(instance) {
      const { vehicle, name, surname, phone, adress, expectedRTime } = instance;
      const dTable = DOMUtils.get.DOMElements.delivery.dTable;
      const row = DOMUtils.create.row;

      if (instance !== undefined) {
        row.innerHTML = `
      <td>${vehicle}</td>
      <td>${name}</td>
      <td>${surname}</td>
      <td>${phone}</td>
      <td>${adress}</td>
      <td>${expectedRTime || ''}</td>
        `;
      }
      dTable.appendChild(row);
    }
  }
};
