/**
 * Class for handling time related operations and formatting
 * Here we have decided to go for composition instead of inheritance, because instead of sharing common basic properties/methods, we are going to use shared functionality from each of the classes.
 */
export class Time {
  /**
   * Initializes a Time instance with a date object.
   * @param {Date} dateObject - JavaScript Date Object
   */
  constructor(dateObject) {
    this.dateObject = dateObject;
    this.display = new DisplayTime(dateObject);
    this.convert = new ConvertTime(dateObject);
  }

  /**
   * Adds a specified number of minutes to the current time.
   * @param {Number} minutes - Number of minutes to add.
   * @returns {String} - The updated time in 'HH:MM' format.
   */
  addTime(minutes) {
    const d = new Date(this.dateObject);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toLocaleTimeString({}, { timeStyle: 'short' });
  }

  /**
   * Compares return time up against current time to see if late.
   * @param {String} value - The return time
   * @returns {Boolean} - Returns a boolean that represents the lateness state.
   */
  isLate(value) {
    const returnTime = this.convert.convertHoursToMins(value);
    const currentTime = this.display.currentTimeInMins;
    return returnTime < currentTime;
  }

  /**
   * Calculates the difference between return time and current time.
   * @param {String} value - The return time.
   * @returns {Number} - Amount of time in minutes the employee is late by.
   */
  lateBy(value) {
    const returnTime = this.convert.convertHoursToMins(value);
    const currentTime = this.display.currentTimeInMins;
    return currentTime - returnTime;
  }
}
/**
 * Class for handlig time related display operations and formatting.
 */
export class DisplayTime {
  /**
   * Initializes a Time instance with a date object.
   * @param {Date} dateObject - JavaScript Date Object
   */
  constructor(dateObject) {
    this.dateObject = dateObject;
  }

  /**
   * Uses Date object methods to specify a format of Date and Time.
   * @returns {String}- Formatted string containing current date and time.
   */
  get displayDateAndTime() {
    const d = this.dateObject;
    const currentDate = d.toLocaleDateString('en-US', { dateStyle: 'full' });
    const currentTime = d.toLocaleTimeString(
      {},
      { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    );
    return `${currentDate} at ${currentTime}`;
  }

  /**
   * Converts current time to a readable format in hours.
   * @returns {String}- Current time in 'HH:MM' format.
   */
  get currentTimeInHours() {
    const d = this.dateObject;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  /**
   * Converts current time to minutes
   * @returns {Number} - Current time in minutes
   */
  get currentTimeInMins() {
    const d = this.dateObject;
    return d.getHours() * 60 + d.getMinutes();
  }

  /**
   * Creates a new Date object and updated the HTML element for every second.
   * @param {Element} clockElement - HTML element where the time is being displayed
   */
  displayTime(clockElement) {
    setInterval(() => {
      this.dateObject = new Date();
      clockElement.innerText = this.displayDateAndTime;
    }, 1000);
  }
}

/**
 * Class for handling time related conversions.
 */
export class ConvertTime {
  /**
   * Initializes a Time instance with a date object.
   * @param {Date} dateObject - JavaScript Date Object
   */
  constructor(dateObject) {
    this.dateObject = dateObject;
  }

  /**
   * Converts hours to minutes , ie '10:56' = 656
   * @param {String} hourFormat - Time in 'HH:MM' format.
   * @returns {Number} - Hours in minutes.
   */
  convertHoursToMins(hourFormat) {
    const timeParts = hourFormat.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes to hours
   * @param {Number} minutes - Time in minutes.
   * @returns {String} - Formatted time string: 'HH:MM'.
   */
  convertMinsToHours(minutes) {
    const h = parseInt(minutes / 60);
    const m = parseInt(Math.round(minutes - h * 60));
    return m === 0 ? `${h} h` : `${h} h: ${m} m`;
  }
}
