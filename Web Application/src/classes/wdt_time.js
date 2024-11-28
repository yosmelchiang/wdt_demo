export class Time {
    constructor(dateObject) {
      this.dateObject = dateObject;
    }
  
    //Time display
    displayDateAndTime() { //Displays current date and time
      const d = this.dateObject;
      const currentDate = d.toLocaleDateString('en-US', { dateStyle: 'full' });
      const currentTime = d.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false  });
      return `${currentDate} at ${currentTime}`;
    }
  
    currentTimeInHours() { //Display only the time in HH:MM format
      const d = this.dateObject;
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false  });
    }
  
    currentTimeInMins() { //Displays the current time in minute format
      const d = this.dateObject;
      return d.getHours() * 60 + d.getMinutes();
    }
  
    /**
     * @description - Adds time to current time
     * @param {Number} minutes - Accepts a time duration in minutes
     * @returns {String} - Returns time in a HH:MM format
     */
    addTime(minutes) { 
      const d = this.dateObject;
      d.setMinutes(d.getMinutes() + minutes);
      return d.toLocaleTimeString({}, { timeStyle: 'short'})
    }
  
    //Time conversions
    convertHoursToMins(hourFormat) { //Converts hours to minutes, accepts a string format, ie '10:56' > 656
      const timeParts = hourFormat.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      return hours * 60 + minutes;
    }

    convertMinsToHours(minutes) {
        const h = parseInt(minutes / 60);
        const m = parseInt(Math.round(minutes - h * 60));
        return m === 0 ? `${h} h` : `${h} h: ${m} m`;
    }
  
  }
