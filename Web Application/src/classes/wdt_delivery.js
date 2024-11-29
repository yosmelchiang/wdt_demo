import { Employee } from './wdt_employee.js';
import { getRowId } from '../utils/wdt_utility.js';
import { factory } from './wdt_factory.js';

//Toast container where we will be creating our toasts
const toastContainer = document.getElementsByClassName('toast-container')[0];

// #region DELIVERY CLASS

export class Delivery extends Employee {
  constructor(JSObject) {
    super(JSObject); //Inherit name and surname from Employee
    this.name = JSObject.name;
    this.surname = JSObject.surname;
    this.vehicle = JSObject.vehicle;
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.expectedRTime = JSObject.expectedRTime;
  }

  get id() {
    return `${this.name}.${this.surname}`;
  }

  deliveryDriverIsLate(deliveryMap) {
    const checkIfLate = setInterval(() => {
      const time = factory.createEmployee('time', new Date());
      const returnTime = time.convertHoursToMins(this.expectedRTime);
      const currentTime = time.currentTimeInMins();
      // const deliveryID = `${this.name}.${this.surname}`;
      const deliveryID = this.id;

      if (deliveryMap.has(deliveryID)) {
        if (returnTime < currentTime) {
          //Calculate lateness
          const timeLate = time.convertMinsToHours(currentTime - returnTime);

          //Create toast notification data and message
          const toastData = {
            container: toastContainer,
            id: deliveryID,
            name: this.name,
            surname: this.surname,
            phone: this.phone,
            adress: this.adress,
            return: this.expectedRTime,
            message: `Late by: ${timeLate} mins`
          };

          const toastInstance = factory.createEmployee('deliveryNotification', toastData);
          toastInstance.Notify();
          clearInterval(checkIfLate);
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, 60000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
    return checkIfLate;
  }
}

// #endregion

// #region VALIDATE INPUT FIELDS
export function validateDelivery(inputs) {
  let errorMessage = '';
  const time = factory.createEmployee('time', new Date());
  const inputTime = time.convertHoursToMins(inputs.expectedRTime);
  const currentTime = time.currentTimeInMins();

  const invalidName = inputs.name.trim() === '' || !isNaN(inputs.name);
  const invalidSurname = inputs.surname.trim() === '' || !isNaN(inputs.surname);
  const invalidPhone = inputs.phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
  const invalidAdress = inputs.adress.trim() === '';
  const invalidReturnTime = inputs.expectedRTime.trim() === '' || inputTime < currentTime;

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
}

// #endregion

// #region ADD / CLEAR DELIVERIES
/**
 *
 * @param {Object} inputs - Object containing input values
 * @returns {Class} - Class instance created
 */
export function addDelivery(inputs, deliveryMap) {
  const errorMessage = validateDelivery(inputs);
  const deliveryInstance = factory.createEmployee('delivery', inputs);
  const deliveryID = deliveryInstance.id;

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  if (!deliveryMap.has(deliveryID)) {
    deliveryMap.set(deliveryID, deliveryInstance);
    deliveryInstance.deliveryDriverIsLate(deliveryMap);
  } else {
    alert('This user has already been added the board.');
  }
  return deliveryInstance;
}

/**
 *
 * @param {Array of rows} rows - The selected HTML DOM Row array containing one or more rows.
 * @param {Map} staffMap - The map containing all instances.
 */
export function clearDelivery(rows, deliveryMap) {
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const deliveryID = getRowId(row);

      let message = `
      Are you sure you want to clear ${deliveryID.replace('.', ' ')} from the board?
      `;
      if (confirm(message) == true) {
        deliveryMap.delete(deliveryID);
        row.remove();
      }
    }
  }
}
// #endregion
