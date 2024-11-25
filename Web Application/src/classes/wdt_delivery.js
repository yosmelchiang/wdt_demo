import { Employee } from './wdt_employee.js';
import { deliveryMap } from '../wdt_app.js';
import {
  convertHoursToMinutes,
  convertMinutesToHours,
  currentTimeInMinutes
} from '../utils/wdt_time.js';
import { createToast } from '../components/wdt_toast.js';

const toastContainer = document.getElementsByClassName('toast-container')[0];

export class Delivery extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherit name and surname from Employee
    this.vehicle = JSObject.vehicle;
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.expectedRTime = JSObject.expectedRTime;
  }

  checkLateness() {
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
    }, 1000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
    return checkIfLate;
  }
}
