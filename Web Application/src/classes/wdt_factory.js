import { Delivery } from './wdt_delivery.js';
import { DeliveryNotification, StaffNotification } from './wdt_notification.js';
import { Staff } from './wdt_staff.js';
import { Time } from './wdt_time.js';

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
        case 'time':
            return new Time(object)
        case 'staffNotification':
          return new StaffNotification(object)
        case 'deliveryNotification':
          return new DeliveryNotification(object)
        default:
          throw new Error(`Unknown type: ${type}`)
      }
    }
  }
  
  export const factory = new EmployeeFactory();