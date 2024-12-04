import { Employee } from './wdt_employee.js';
import { factory } from './wdt_factory.js';

// #region STAFF CLASS
export class Staff extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname);
    this.picture = JSObject.picture; //Staff-specific properties
    this.email = JSObject.email;
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';
  }

  //Getters
  get id() {
    return `${this.name}.${this.surname}`;
  }

  //Setters
  set out(JSObject) {
    this.status = 'Out';
    this.outTime = JSObject.outTime;
    this.duration = JSObject.duration;
    this.expectedRTime = JSObject.returnTime;
  }

  set in(value) { //The value doesnt serve any purpose, but we need a value in a set accessor so we are just using a placeholder
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';
  }

  //Methods
  staffMemberIsLate(EMPLOYEES) {
    const { lateInterval } = EMPLOYEES.get('config');

    const checkIfLate = setInterval(() => {
      const time = factory.createEmployee('time', new Date());
      const late = time.isLate(this.expectedRTime);

      if (this.status === 'Out') {
        if (late) {
          //Create toast notification data and message
          const toastData = {
            id: this.id,
            picture: this.picture,
            name: this.name,
            surname: this.surname,
            message: `Late by: ${time.lateBy(this.expectedRTime)} mins`
          };

          const toastInstance = factory.createEmployee('staffNotification', toastData);
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

/**
 *
 * @param {DOM element} row - The current HTML DOM element.
 * @param {Class} instance - The current Class element.
 */
// function updateDOM(row, instance) {
//   if (instance.status === 'Out') {
//     row.cells[4].innerHTML = instance.status;
//     row.cells[5].innerHTML = instance.outTime;
//     row.cells[6].innerHTML = instance.duration;
//     row.cells[7].innerHTML = instance.expectedRTime;
//   } else {
//     row.cells[4].innerHTML = instance.status;
//     row.cells[5].innerHTML = '';
//     row.cells[6].innerHTML = '';
//     row.cells[7].innerHTML = '';
//   }
// }
// #endregion
