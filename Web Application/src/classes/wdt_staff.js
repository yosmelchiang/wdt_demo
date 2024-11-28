import { Employee } from './wdt_employee.js';
import { createToast } from '../components/wdt_toast.js';
import { getRowId, getUserDuration } from '../utils/wdt_utility.js';
import { Time } from './wdt_time.js';

// #region STAFF CLASS
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

  out(row, outTime, duration, expectedRTime) {
    this.status = 'Out';
    this.outTime = outTime;
    this.duration = duration;
    this.expectedRTime = expectedRTime;

    updateDOM(row, this);
  }

  in(row) {
    this.status = 'In';
    this.outTime = '';
    this.duration = '';
    this.expectedRTime = '';

    updateDOM(row, this);
  }

  staffMemberIsLate(staffMap) {
    const checkIfLate = setInterval(() => {
      const time = new Time(new Date());
      const returnTime = time.convertHoursToMins(this.expectedRTime);
      const currentTime = time.currentTimeInMins();
      const staffID = `${this.name}.${this.surname}`;

      if (staffMap.has(staffID) && this.status === 'Out') {
        if (returnTime < currentTime) {
          //Calculate lateness
          const timeLate = time.convertMinsToHours(currentTime - returnTime);

          //Create toast notification data and message
          const toastData = {
            id: staffID,
            picture: this.picture,
            name: this.name,
            surname: this.surname,
            message: `Late by: ${timeLate} mins`
          };

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
// #endregion 

// #region STAFF IN / OUT AND DOM TABLE UPDATE
/**
 *
 * @param {Array of rows} rows - The selected HTML DOM Row array containing one or more rows.
 * @param {Map} staffMap - The map containing all instances.
 */
export function staffOut(rows, staffMap) {
  if (rows.length > 0) {
    const input = getUserDuration();

    //If the user cancels the prompt window, we want to de-select the rows and cancel the function
    if (input === null) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.classList.remove('selectedRow');
      }
      return; //Exit the function when the user cancels
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const time = new Time(new Date()); //We are creating a new instance of the Time class, with a Date object
      const outTime = time.currentTimeInHours();
      const duration = time.convertMinsToHours(input);
      const returnTime = time.addTime(input);

      const staffID = getRowId(row);
      const staffInstance = staffMap.get(staffID);

      staffInstance.out(row, outTime, duration, returnTime);
      staffInstance.staffMemberIsLate(staffMap);

      row.classList.remove('selectedRow');
    }
  }
}

/**
 *
 * @param {Array of rows} rows - The selected HTML DOM Row array containing one or more rows.
 * @param {Map} staffMap - The map containing all instances.
 */
export function staffIn(rows, staffMap) {
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const staffID = getRowId(row);
      const staffInstance = staffMap.get(staffID);

      if (staffInstance) {
        staffInstance.in(row);
      }

      row.classList.remove('selectedRow');
    }
  }
}

/**
 *
 * @param {DOM element} row - The current HTML DOM element.
 * @param {Class} instance - The current Class element.
 */
function updateDOM(row, instance) {
  if (instance.status === 'Out') {
    row.cells[4].innerHTML = instance.status;
    row.cells[5].innerHTML = instance.outTime;
    row.cells[6].innerHTML = instance.duration;
    row.cells[7].innerHTML = instance.expectedRTime;
  } else {
    row.cells[4].innerHTML = instance.status;
    row.cells[5].innerHTML = '';
    row.cells[6].innerHTML = '';
    row.cells[7].innerHTML = '';
  }
}
// #endregion