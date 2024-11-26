import { Employee } from './wdt_employee.js';
import { deliveryMap } from '../wdt_app.js';
import {
  convertHoursToMinutes,
  convertMinutesToHours,
  currentTimeInMinutes
} from '../utils/wdt_time.js';
import { createToast } from '../components/wdt_toast.js';

export class Delivery extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherit name and surname from Employee
    this.vehicle = JSObject.vehicle;
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.expectedRTime = JSObject.expectedRTime;
  }

  deliveryDriverIsLate() {
    const toastData = {
      id: `${this.name}.${this.surname}`,
      name: this.name,
      surname: this.surname,
      phone: this.phone,
      adress: this.adress,
      return: this.expectedRTime,
      message: `Late by: ${convertMinutesToHours(
        currentTimeInMinutes() - convertHoursToMinutes(this.expectedRTime)
      )} mins`
    };

    const checkIfLate = setInterval(() => {
      if (deliveryMap.has(toastData.id)) {
        if (convertHoursToMinutes(this.expectedRTime) < currentTimeInMinutes()) {
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

export function addDelivery(jsUser) {  
  const newDelivery = new Delivery(jsUser);
  newDelivery.deliveryDriverIsLate();
  return newDelivery;
}

export function validateDelivery(jsUser) {
  let errorMessage = '';

  const invalidName = jsUser.name.trim() === '' || !isNaN(jsUser.name);
  const invalidSurname = jsUser.surname.trim() === '' || !isNaN(jsUser.surname);
  const invalidPhone = jsUser.phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
  const invalidAdress = jsUser.adress.trim() === '';
  const invalidReturnTime =
    jsUser.expectedRTime.trim() === '' ||
    convertHoursToMinutes(jsUser.expectedRTime) < currentTimeInMinutes();

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