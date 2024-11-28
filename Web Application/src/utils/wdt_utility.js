// #region Duration Input Validation

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

// #region DOM Table Row population
/** ROW POPULATION: Staff and Delivery table
 * @description - This function will populate the DOM with the class instance
 * @param {DOM} element - DOM element, usually a table body
 * @param {Class} instance - Class object and its properties
 */
export function populateRow(table, instance, type) {
  const row = document.createElement('tr');

  if (type === 'staff') {
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
  } else if (type === 'delivery') {
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

// #region DATE AND TIME

//DIGITAL CLOCK
export function digitalClock() {
  const d = new Date();
  const currentDate = d.toLocaleDateString('en-US', { dateStyle: 'full' });
  const currentTime = d.toLocaleTimeString({}, { timeStyle: 'medium' });

  return `${currentDate} at ${currentTime}`;
}

//TIME CALCULATIONS
/**
 * @description - Calculate a return time based on a given duration i minutes.
 * @param {Number} minutes - Time duration in minutes
 * @returns {String} - A string of the time in HH:MM format
 */
export function calculateReturnTime(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toLocaleTimeString({}, { timeStyle: 'short'})
}

//TIME CONVERSIONS
/**
 * @description This function uses a Date object to return the current time in minutes
 * @returns {Number} - Current time in minutes
 */
export function timeInMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * @description - Converts time in HH:MM format to minutes
 * @param {String} time - Time in HH:MM format is split, and converted to minutes
 * @returns {Number} - A single number of minutes
 */
export function hoursToMinutes(time) {
  const timeParts = time.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  return hours * 60 + minutes;
}

/**
 * @description - Convert time from minutes to a readable HH:MM format
 * @param {Number} totalMinutes - Takes a duration in minutes as a parameter.
 * @returns {String} - Returns a formatted duration in string, ie: Duration: 0 h: 2 m
 */
export function minutesToHours(min) {
  const hours = parseInt(min / 60);
  const minutes = parseInt(Math.round(min - hours * 60));
  return minutes === 0 ? `${hours} h` : `${hours} h: ${minutes} m`;
}

// #endregion
