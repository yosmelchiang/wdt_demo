// #region Duration Input Validation

import { convertHoursToMinutes, currentTimeInMinutes } from './wdt_time.js';

/** INPUT VALIDATOR
 * @description - Validates the user input for duration.
 *              - We are looking to validate empty input, non numeric values and negative numbers
 * @param {String} input - The user input.
 * @returns {Boolean} - This will be true if the input is invalid, false otherwise
 */
export function invalidDuration(input) {
  return input.trim() === '' || isNaN(input) || input <= 0;
}

/** PROMPT AND CHECKS FOR VALID OUT DURATION
 * @description - Prompts the user for a duration, the prompt is only passed on valid input.
 * @returns {number} - Valid duration in number, no negative numbers allowed.
 */

export function getUserDuration() {
  while (true) {
    const userInput = prompt('How long are you going to be gone for?');
    if (!invalidDuration(userInput)) {
      return parseInt(userInput);
    } else {
      alert('Invalid input, try again');
    }
  }
}
// #endregion

// #region Schedule Delivery Input Validation
/**
 *
 * @param {Object} JSObject
 * @returns {String} - An errorMessage that will pop up on the browser as an alert
 */
export function validateInput(JSObject) {
  let errorMessage = '';

  const invalidName = JSObject.name.trim() === '' || !isNaN(JSObject.name);
  const invalidSurname = JSObject.surname.trim() === '' || !isNaN(JSObject.surname);
  const invalidPhone = JSObject.phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
  const invalidAdress = JSObject.adress.trim() === '';
  const invalidReturnTime =
    JSObject.expectedRTime.trim() === '' ||
    convertHoursToMinutes(JSObject.expectedRTime) < currentTimeInMinutes();

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
// #endregion Validation

// #region DOM Table Row population
/** ROW POPULATION: Staff and Delivery table
 * @description - This function will populate the DOM table with the fetched user from api
 * @param {DOM element} table - Receives a DOM element, usually a table body
 * @param {Class} instance - Receives a class object and its properties
 */
export function populateRow(table, instance, type) {
  const row = document.createElement('tr');

  if (type === 'staffRow') {
    row.innerHTML = `
    <td><img src="${instance.picture}" alt="Staff Picture"></td>
    <td>${instance.name}</td>
    <td>${instance.surname}</td>
    <td>${instance.email}</td>
    <td>${instance.status}</td>
    <td>${instance.outTime}</td>
    <td>${instance.duration}</td>
    <td>${instance.expectedRTime}</td>
    `;
  } else if (type === 'deliveryRow') {
    row.innerHTML = `
    <td>${instance.vehicle}</td>
    <td>${instance.name}</td>
    <td>${instance.surname}</td>
    <td>${instance.phone}</td>
    <td>${instance.adress}</td>
    <td>${instance.expectedRTime || ''}</td>
  `;
  } else {
    console.log('Something went wrong');
    return;
  }
  table.appendChild(row);
}

/** ROW ID: Staff and Deliery table
 * @description - A row ID consists of a 'Name.Surname' string and is used for storing, retrieving and deleting class instances in maps.
 * @param {Table row} row - Accept a single element of <tr> type.
 * @returns {String} - A concatenated string representing innerText of cell 1 and 2 from table row.
 */
export function getRowId(row) {
  const name = row.getElementsByTagName('td')[1].innerText;
  const surname = row.getElementsByTagName('td')[2].innerText;
  return name + '.' + surname;
}

// #endregion
