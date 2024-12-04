export class Time {
    constructor(dateObject) {
      this.dateObject = dateObject;
    }

    //Getters
    get displayDateAndTime() {
      const d = this.dateObject;
      const currentDate = d.toLocaleDateString('en-US', { dateStyle: 'full' });
      const currentTime = d.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false  });
      return `${currentDate} at ${currentTime}`;
    }
  
    get currentTimeInHours() { //Display only the time in HH:MM format
      const d = this.dateObject;
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false  });
    }
  
    get currentTimeInMins() { //Displays the current time in minute format
      const d = this.dateObject;
      return d.getHours() * 60 + d.getMinutes();
    }

    //Methods
    addTime(minutes) { 
      const d = new Date(this.dateObject)
      d.setMinutes(d.getMinutes() + minutes);
      return d.toLocaleTimeString({}, { timeStyle: 'short'})
    }

    displayTime(clockElement) {
      setInterval(() => {
        this.dateObject = new Date();
        clockElement.innerText = this.displayDateAndTime;
      }, 1000)
    }

    isLate(value) {
      const returnTime = this.convertHoursToMins(value);
      const currentTime = this.currentTimeInMins;
      return returnTime < currentTime
    }

    lateBy(value) {
      const returnTime = this.convertHoursToMins(value);
      const currentTime = this.currentTimeInMins;
      return currentTime - returnTime
    }
  
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
