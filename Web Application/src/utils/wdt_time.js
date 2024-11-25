// #region CONSTANTS
const DATES = {
  weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
};
// #endregion

// #region VISUAL CLOCK
/**
 * The purpose of this function is to provide a real time clock at the bottom of the page
 */
export function digitalClock() {
  const d = new Date();
  const hh = addZero(d.getHours());
  const mm = addZero(d.getMinutes());
  const ss = addZero(d.getSeconds());

  const currentTime = `${hh}:${mm}:${ss}`;
  const day = DATES.weekdays[d.getDay()];
  const monthName = DATES.months[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const currentDate = `${day}, ${monthName} ${date}, ${year} at`;

  //Update the DOM element with the current date and time.
  return `${currentDate} ${currentTime}`;

  //Schedule a new update with 1 second delay between each update
}
// #endregions

// #region utilities
/**
 * @description - The purpose of this function to to make sure the format is corrected if necessary.
 *              - Bad format: 2 h: 5 mins
 *              - Good format: 02 h : 50 mins
 * @param {Number} i - A date object method such as getHours() or getMinutes()
 * @returns {Number} - Returns the original number with a Zero concatenated to it
 */
export function addZero(i) {
  return i < 10 ? `0${i}` : `${i}`;
}

/**
 * @description Converts the current time to a readable string format.
 * @returns {String} - A simple string with the current time in HH:MM format.
 */
export function timeStamp() {
  const d = new Date();
  const hh = addZero(d.getHours());
  const mm = addZero(d.getMinutes());
  return `${hh}:${mm}`;
}
// #endregion

// #region CONVERSIONS
export function currentTimeInMinutes() {
  let d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * @description - The purpose of this function is to convert time in HH:MM format to minutes
 * @param {String} time - Time in HH:MM format is split, and converted to minutes
 * @returns {Number} - A single number of minutes
 */
export function convertHoursToMinutes(time) {
  const timeParts = time.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  return hours * 60 + minutes;
}

/**
 * @description - The purpose of this function is to convert time from minutes to a readable HH:MM format
 * @param {Number} totalMinutes - Takes a duration in minutes as a parameter.
 * @returns {String} - Returns a formatted duration in string, ie: Duration: 0 h: 2 m
 */
export function convertMinutesToHours(totalMinutes) {
  const hours = addZero(parseInt(totalMinutes / 60));
  const minutes = addZero(parseInt(Math.round(totalMinutes - hours * 60)));
  return minutes === 0 ? `${hours} h` : `${hours} h: ${minutes} m`;
}

/** RETURN TIME CALCULATOR MINUTES
 * @description - Higher order function which takes the current time in minutes, and the additional passed time in minutes.
 *              - The inner function alculates these together to return the time in hour back, this is going to be the Expected Return Time.
 * @param {Number} baseMinutes  - Takes the current base time in minutes
 * @returns {Function} - Takes additional time in minutes, which then is calculated to a total time from minutes to hours
 */
export function createReturnTimeCalculator(baseMinutes) {
    //Outfunc receives the global time in minutes
    return function (additionalMinutes) {
      //Inner function receives a specific time in minutes
      const totalMinutes = baseMinutes + additionalMinutes; //Calculates total minutes for later reference
      return totalMinutes;
    };
  }
  
  /** RETURN TIME HH:MM FORMAT
   * @param {Number} totalMinutes - Takes in minutes and turns them to hh:mm
   * @returns {String} - String of hours and minutes
   */
  export function returnTimeFormat(totalMinutes) {
    const hours = parseInt(totalMinutes / 60);
    const minutes = Math.round((totalMinutes / 60 - hours) * 60);
    return `${addZero(hours)}:${addZero(minutes)}`;
  }
// #endregion
