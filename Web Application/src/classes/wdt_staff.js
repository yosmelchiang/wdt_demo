import { staffMap } from '../wdt_app.js';
import { Employee } from './wdt_employee.js';
import {
  convertHoursToMinutes,
  convertMinutesToHours,
  currentTimeInMinutes
} from '../utils/wdt_time.js';
import { createToast } from '../components/wdt_toast.js';

// const toastContainer = document.getElementsByClassName('toast-container')[0];

export class Staff extends Employee {
  constructor(JSObject) {
    super(JSObject.name, JSObject.surname); //Inherits name and surname from Employee
    this.picture = JSObject.picture; //Staff-specific properties
    this.email = JSObject.email;
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';
  }

  staffOut(row, outTime, expectedRTime) {
    this.outTime = outTime;
    this.expectedRTime = expectedRTime;
    this.status = 'Out';
    row.cells[4].innerHTML = this.status; //Changes the HTML element status to 'Out'
    this.staffMemberIsLate(); //Initialize check lateness
  }

  staffIn(row) {
    //Uppdating Class properties
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';

    //Updating HTML elements, there has to be a cleaner method for this, maybe a function?
    row.cells[4].innerHTML = this.status; //Changes the HTML element status to 'In'
    row.cells[5].innerHTML = '';
    row.cells[6].innerHTML = '';
    row.cells[7].innerHTML = '';
  }

  staffMemberIsLate() {
    const toastData = {
      id: `${this.name}.${this.surname}`,
      picture: this.picture,
      name: this.name,
      surname: this.surname,
      message: `Late by: ${convertMinutesToHours(
        currentTimeInMinutes() - convertHoursToMinutes(this.expectedRTime)
      )} mins`
    };

    const checkIfLate = setInterval(() => {
      if (staffMap.has(toastData.id)) {
        if (convertHoursToMinutes(this.expectedRTime) < currentTimeInMinutes()) {
          createToast('staff', toastData);
          clearInterval(checkIfLate);
        }
      } else {
        clearInterval(checkIfLate);
      }
    }, 6000); //Change this to 60000 (1min) interval instead of 1 second to prevent performance issues
    return checkIfLate;
  }
}
