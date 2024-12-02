import { Employee } from './wdt_employee.js';
import { factory } from './wdt_factory.js';

// #region DELIVERY CLASS

export class Delivery extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherit name and surname from Employee
    this.vehicle = JSObject.vehicle;
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.expectedRTime = JSObject.expectedRTime;
  }

  get id() {
    return `${this.name}.${this.surname}`;
  }

  deliveryDriverIsLate(EMPLOYEES) {
    const { toastContainer } = EMPLOYEES.get('DOM Elements');
    const { lateInterval } = EMPLOYEES.get('config');
    const deliveries = EMPLOYEES.get('deliveries');

    const checkIfLate = setInterval(() => {
      const time = factory.createEmployee('time', new Date());
      const late = time.isLate(this.expectedRTime);
      const deliveryID = this.id;

      if (deliveryID in deliveries) {
        if (late) {
          //Create toast notification data and message
          const toastData = {
            container: toastContainer,
            id: deliveryID,
            name: this.name,
            surname: this.surname,
            phone: this.phone,
            adress: this.adress,
            return: this.expectedRTime,
            message: `Late by: ${time.lateBy(this.expectedRTime)} mins`
          };

          const toastInstance = factory.createEmployee('deliveryNotification', toastData);
          toastInstance.Notify();
          clearInterval(checkIfLate);
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, lateInterval); //Change the interval in WDT_APP.js Settings
    return checkIfLate;
  }
}

// #endregion
