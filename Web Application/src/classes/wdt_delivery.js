import { Employee } from './wdt_employee.js';
import { hoursToMinutes, minutesToHours, timeInMinutes } from '../utils/wdt_time.js';
import { createToast } from '../components/wdt_toast.js';
import { getRowId } from '../utils/wdt_utility.js';

export class Delivery extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherit name and surname from Employee
    this.vehicle = JSObject.vehicle;
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.expectedRTime = JSObject.expectedRTime;
  }

  deliveryDriverIsLate(deliveryMap) {
    const toastData = {
      id: `${this.name}.${this.surname}`,
      name: this.name,
      surname: this.surname,
      phone: this.phone,
      adress: this.adress,
      return: this.expectedRTime,
      message: `Late by: ${minutesToHours(
        timeInMinutes() - hoursToMinutes(this.expectedRTime)
      )} mins`
    };

    const checkIfLate = setInterval(() => {
      if (deliveryMap.has(toastData.id)) {
        if (hoursToMinutes(this.expectedRTime) < timeInMinutes()) {
          createToast('delivery', toastData);
          clearInterval(checkIfLate);
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, 6000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
    return checkIfLate;
  }
}

export function validateDelivery(inputs) {
  let errorMessage = '';

  const invalidName = inputs.name.trim() === '' || !isNaN(inputs.name);
  const invalidSurname = inputs.surname.trim() === '' || !isNaN(inputs.surname);
  const invalidPhone = inputs.phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
  const invalidAdress = inputs.adress.trim() === '';
  const invalidReturnTime =
    inputs.expectedRTime.trim() === '' || hoursToMinutes(inputs.expectedRTime) < timeInMinutes();

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

/**
 *
 * @param {Object} inputs - Object containing input values
 * @returns {Class} - Class instance created
 */
export function addDelivery(inputs, deliveryMap) {
  const errorMessage = validateDelivery(inputs);
  const deliveryID = inputs.name + '.' + inputs.surname;
  let newDelivery;

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  if (!deliveryMap.has(deliveryID)) {
    newDelivery = new Delivery(inputs);

    deliveryMap.set(deliveryID, newDelivery);
    newDelivery.deliveryDriverIsLate(deliveryMap);
  } else {
    alert('This user has already been added the board.');
  }

  return newDelivery;
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
