const DOMInterface = {


};

export const DOMUtils = {

  get createRow() {
    return document.createElement('tr');
  },

  get getDOMElements() {
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
        toastContainer: document.getElementsByClassName('toast-container')[0]
      }
    };
  },

  getRowId(row) {
    const name = row.getElementsByTagName('td')[1].innerText;
    const surname = row.getElementsByTagName('td')[2].innerText;
    return name + '.' + surname;
  },

  populateStaff(instance) {
    const { picture, name, surname, email, status, outTime, duration, expectedRTime } = instance;
    const sTable = this.getDOMElements.staff.sTable;
    const row = this.createRow;

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
    const dTable = this.getDOMElements.delivery.dTable;
    const row = this.createRow;

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
  },
};

// #region DURATION PROMPT AND VALIDATION
/** PROMPT AND CHECKS FOR VALID OUT DURATION
 * @description - Prompts the user for a duration, the prompt is only passed on valid input.
 * @returns {number} - Valid duration in number, no negative numbers allowed.
 */
export function getUserDuration() {
  while (true) {
    const userInput = prompt('Please enter the number of minutes the staff member will be out:');

    if (userInput === null) {
      return null; //Return null back to staffOut if the user cancels
    }
    if (!invalidDuration(userInput)) {
      return parseInt(userInput);
    } else {
      alert('Invalid input, try again');
    }
  }
}

/** INPUT VALIDATOR
 * @description - Validates the user input for duration.
 *              - We are looking to validate empty input, non numeric values and negative numbers
 * @param {String} input - The user input.
 * @returns {Boolean} - This will be true if the input is invalid, false otherwise
 */
export function invalidDuration(input) {
  if (input === null) {
    return true;
  }
  return input.trim() === '' || isNaN(input) || input <= 0;
}

export function createToast(toastDiv, toastId) {
  //Activate and show Bootstrap Toast
  const toastWindow = document.getElementById(`${toastId}`);
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
  toastBootstrap.show();

  toastWindow.addEventListener('hidden.bs.toast', () => {
    toastDiv.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
  });
}

// #endregion
