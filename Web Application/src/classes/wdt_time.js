//Our time related classes, here we have decided to go for composition instead of inheritance.

export class Time {
    constructor(dateObject) {
      this.dateObject = dateObject;
      this.display = new DisplayTime(dateObject);
      this.convert = new ConvertTime(dateObject);
    }

    //Methods
    addTime(minutes) { 
      const d = new Date(this.dateObject)
      d.setMinutes(d.getMinutes() + minutes);
      return d.toLocaleTimeString({}, { timeStyle: 'short'})
    }

    isLate(value) {
      const returnTime = this.convert.convertHoursToMins(value);
      const currentTime = this.display.currentTimeInMins;
      return returnTime < currentTime
    }

    lateBy(value) {
      const returnTime = this.convert.convertHoursToMins(value);
      const currentTime = this.display.currentTimeInMins;
      return currentTime - returnTime
    }  
  }

export class DisplayTime{
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
      
    displayTime(clockElement) {
      setInterval(() => {
        this.dateObject = new Date();
        clockElement.innerText = this.displayDateAndTime;
      }, 1000)
    }
}

export class ConvertTime {
  constructor(dateObject) {
    this.dateObject = dateObject;
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