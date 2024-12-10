import { Delivery } from './wdt_delivery.js';
import { DeliveryNotification, StaffNotification, SystemNotification } from './wdt_notification.js';
import { Staff } from './wdt_staff.js';
import { ConvertTime, DisplayTime, Time } from './wdt_time.js';

class EmployeeFactory {
  /**
   * Factory for creating instances of various classes.
   * @param {String} type - The type of instance to create.
   * @param {Object} object - The data to initialize the instance with.
   * @returns {Object} An instance of the requested type.
   */
    createEmployee(type, object) {
      switch (type) {
        case 'staff':
          return new Staff(object);
        case 'delivery':
          return new Delivery(object)
        default:
          throw new Error(`Unknown type: ${type}`)
      }
    }

    createTime(type, object) {
      switch (type) {
        case 'time':
          return new Time(object)
        case 'display':
          return new DisplayTime(object)
        case 'convert':
          return new ConvertTime(object)
        default:
          throw new Error(`Unknown type: ${type}`)
      }
    }

    createNotification(type, object) {
      switch (type) {
        case 'staff':
          return new StaffNotification(object)
        case 'delivery':
          return new DeliveryNotification(object)
        case 'system':
          return new SystemNotification(object)
        default:
          throw new Error(`Unknown type: ${type}`)
      }
    }
  }
  
  export const factory = new EmployeeFactory();
  