import { DOMInterface } from '../utils/DOMInterface.js';
import { Employee } from './wdt_employee.js';
import { factory } from './wdt_factory.js';

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
    const { lateInterval } = EMPLOYEES.get('config');
    const deliveries = EMPLOYEES.get('deliveries');

    const checkIfLate = setInterval(() => {
      const time = factory.createTime('time', new Date());
      const late = time.isLate(this.expectedRTime);
      const lateBy = time.lateBy(this.expectedRTime);
      const deliveryID = this.id;

      if (deliveryID in deliveries) {
        if (late) {
          const toastId = deliveryID;
          const message = `Late by: ${lateBy} mins`;

          if (!(DOMInterface.toast.activeToasts[toastId])) {
            DOMInterface.toast.create('delivery', {
              id: toastId,
              name: this.name,
              surname: this.surname,
              phone: this.phone,
              adress: this.adress,
              return: this.expectedRTime,
              message: message
            });

            //Pass a callback to clear the interval on notification close
            DOMInterface.toast.show(toastId, () => {
              clearInterval(checkIfLate);
            });
          } else {
            DOMInterface.toast.update(
              toastId,
              `
              <p>${this.name} ${this.surname}</p>
              <p>Return time was: ${this.expectedRTime}</p>
              <p>Address: ${this.adress}</p>
              <p>Phone: ${this.phone}</p>
              <p>${message}</p>
              `
            );
          }
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, lateInterval); //Change the interval in WDT_APP.js Settings
    return checkIfLate;
  }
}
