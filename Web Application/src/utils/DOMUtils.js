export const DOMUtils = {
  //Properties
  DOM: null,

  init() {
    //GET DOM elements
    this.DOM = this.get.DOMElements;
    console.log(
      Object.keys(this.DOM).length > 0
        ? 'DOM: Elements successfully loaded'
        : 'Error while loading DOM elements'
    );
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
    },
  },

  create: {
    get div() {
      return document.createElement('div');
    },

    get row() {
      return document.createElement('tr');
    },
  },

  interact: {
    enableStaffSelection() {
      const rows = DOMUtils.get.DOMElements.staff.sTable.getElementsByTagName('tr');
      for (const row of rows) {
        row.addEventListener('click', function () {
          this.classList.toggle('selectedRow');
        });
      }
    },

    enableDeliverySelection() {
      const rows = DOMUtils.get.DOMElements.delivery.dTable.getElementsByTagName('tr');
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

    useEnterToSubmit(input, submitBtn) {
      if (Object.keys(input).length > 0) {
        for (const field of input) {
          field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              submitBtn.click();
            }
          });
        }
      } else {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            submitBtn.click();
          }
        });
      }
    }
  },

  table: {
    //Setters
    set updateStaff(JSObject) {
      const { row, staffInstance } = JSObject;
      const { status, outTime, duration, expectedRTime } = staffInstance;
      const values =
        status === 'Out' ? [status, outTime, duration, expectedRTime] : [status, '', '', ''];

      for (let i = 0; i < values.length; i++) {
        row.cells[i + 4].innerHTML = values[i];
      }
    },

    getRowId(row) {
      const name = row.getElementsByTagName('td')[1].innerText;
      const surname = row.getElementsByTagName('td')[2].innerText;
      return name + '.' + surname;
    },

    populateStaff(instance) {
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
