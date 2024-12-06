import { DOMInterface } from '../utils/wdt_utility.js';
import { Employee } from './wdt_employee.js';
import { factory } from './wdt_factory.js';

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

  set in(value) {
    //The value doesnt serve any purpose, but we need a value in a set accessor so we are just using a placeholder
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
      const lateBy = time.lateBy(this.expectedRTime);

      if (this.status === 'Out') {
        if (late) {
          const toastId = this.id;
          const message = `Late by: ${lateBy} mins`;

          if (!(DOMInterface.toast.activeToasts[toastId])) {
            DOMInterface.toast.create('staff', {
              id: toastId,
              picture: this.picture,
              name: this.name,
              surname: this.surname,
              message: message
            });

            //Pass a callback to clear the interval on notification close
            DOMInterface.toast.show(toastId, () =>  {
              clearInterval(checkIfLate)
              console.log('Timer stopped')
            });
          } else {
            DOMInterface.toast.update(
              toastId,
              `
            <img src="${this.picture}" alt="Staff Picture">
            <p>${this.name} ${this.surname} is late!</p>
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
