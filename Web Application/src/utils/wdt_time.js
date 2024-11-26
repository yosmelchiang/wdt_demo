// #region DIGITAL CLOCK
/**
 * Provide a real time clock at the bottom of the page
 */
export function digitalClock() {
  const currentDate = new Date().toLocaleDateString('en-US', { dateStyle: 'full'});
  const currentTime = new Date().toLocaleTimeString({}, {timeStyle: 'medium'});

  return `${currentDate} at ${currentTime}`;
}
// #endregions

// #region CONVERSIONS
export function timeInMinutes() {
  let d = new Date();
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
 * @description - Calculate a return time based on a given duration i minutes.
 * @param {Number} minutes - Time duration in minutes
 * @returns {String} - A string of the time in HH:MM format
 */
export function calculateReturnTime(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toLocaleTimeString({}, { timeStyle: 'short'})
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
