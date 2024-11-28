// #region DURATION PROMPT AND VALIDATION
/** PROMPT AND CHECKS FOR VALID OUT DURATION
 * @description - Prompts the user for a duration, the prompt is only passed on valid input.
 * @returns {number} - Valid duration in number, no negative numbers allowed.
 */
export function getUserDuration() {
  while (true) {
    const userInput = prompt('How long are you going to be gone for?');

    if(userInput === null) {
      return null; //Return null back to staffOut if the user cancels
    }
    if (!invalidDuration(userInput)) {
      return parseInt(userInput);
    } else {
      alert('Invalid input, try again');
    }
  }
}

/** INPUT VALIDATOR
 * @description - Validates the user input for duration.
 *              - We are looking to validate empty input, non numeric values and negative numbers
 * @param {String} input - The user input.
 * @returns {Boolean} - This will be true if the input is invalid, false otherwise
 */
export function invalidDuration(input) {
  if(input === null) {
    return true;
  }
  return input.trim() === '' || isNaN(input) || input <= 0;
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