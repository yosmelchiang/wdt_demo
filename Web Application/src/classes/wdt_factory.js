import { Delivery } from './wdt_delivery.js';
import { DeliveryNotification, StaffNotification, SystemNotification } from './wdt_notification.js';
import { Staff } from './wdt_staff.js';
import { ConvertTime, DisplayTime, Time } from './wdt_time.js';

/**
 * Factory class for creating instances of various classes like Employee, Time, and Notifications
 */
class EmployeeFactory {
  /**
   * Creates an instance of the specified Employee type.
   * @param {String} type - The type of instance to create ('staff' / 'delivery').
   * @param {Object} object - The data to initialize the Employee instance with.
   * @returns {Object} An Employee instance of the requested type.
   */
  createEmployee(type, object) {
    switch (type) {
      case 'staff':
        return new Staff(object);
      case 'delivery':
        return new Delivery(object);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  /**
   * Creates an instance of the specified Time type.
   * @param {String} type - The type of instance to create ('time' / 'display' / 'convert').
   * @param {Object} object - The data to initialize the Time instance with.
   * @returns {Object} A Time instance of the requested type.
   */
  createTime(type, object) {
    switch (type) {
      case 'time':
        return new Time(object);
      case 'display':
        return new DisplayTime(object);
      case 'convert':
        return new ConvertTime(object);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  /**
   * Creates an instance of the specified Notificaton type.
   * @param {String} type - The type of instance to create ('staff' / 'delivery' / 'system').
   * @param {Object} object - The data to initialize the Notification instance with.
   * @returns {Object} A Notification instance of the requested type.
   */
  createNotification(type, object) {
    switch (type) {
      case 'staff':
        return new StaffNotification(object);
      case 'delivery':
        return new DeliveryNotification(object);
      case 'system':
        return new SystemNotification(object);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}

export const factory = new EmployeeFactory();
