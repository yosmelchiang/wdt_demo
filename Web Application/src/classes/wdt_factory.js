import { Delivery } from './wdt_delivery.js';
import { DeliveryNotification, StaffNotification } from './wdt_notification.js';
import { Staff } from './wdt_staff.js';
import { Time } from './wdt_time.js';

class EmployeeFactory {
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
          console.log('Unknown employee type');
      }
    }
  }
  
  export const factory = new EmployeeFactory();