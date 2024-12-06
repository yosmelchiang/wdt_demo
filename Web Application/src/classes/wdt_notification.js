import { DOMInterface } from '../utils/DOMInterface.js';
import { DOMUtils } from '../utils/DOMUtils.js';

class Notification {
  constructor(JSObject) {
    this.container = DOMUtils.get.DOMElements.ui.employeeToastContainer;
    this.id = JSObject.id;
    this.name = JSObject.name;
    this.surname = JSObject.surname;
    this.message = JSObject.message;
  }

  content() {
    return `
    <p>${this.name} ${this.surname}</p>
    <p>${this.message}</p>
    `;
  }

  Notify() {
    const div = DOMUtils.create.div;

    div.setAttribute('id', this.id);
    div.setAttribute('class', 'toast text-bg-danger');
    div.setAttribute('role', 'alert');
    div.setAttribute('aria-live', 'assertive');
    div.setAttribute('aria-atomic', 'true');
    div.setAttribute('data-bs-autohide', 'false');

    div.innerHTML = `
        <div class="toast-header text-bg-danger border-0">
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${this.content()}
        </div>
    `;
    this.container.appendChild(div);
  }
}

export class StaffNotification extends Notification {
  constructor(JSObject) {
    super(JSObject);
    this.picture = JSObject.picture;
  }

  content() {
    return `
    <img src="${this.picture}" alt="Staff Picture">
    <p>${this.name} ${this.surname} is late!</p>
    <p>${this.message}</p>
    `;
  }
}

export class DeliveryNotification extends Notification {
  constructor(JSObject) {
    super(JSObject);
    this.phone = JSObject.phone;
    this.adress = JSObject.adress;
    this.return = JSObject.return;
  }

  content() {
    return `
    <p>${this.name} ${this.surname}</p>
    <p>Return time was: ${this.return}</p>
    <p>Address: ${this.adress}</p>
    <p>Phone: ${this.phone}</p>
    <p>${this.message}</p>
  `;
  }
}

// Creating system notifications for stuff like invalid inputs, and whatnot
export class SystemNotification extends Notification {
  constructor(JSObject) {
    super(JSObject)
    this.container = DOMUtils.get.DOMElements.ui.systemToastContainer;
  }

  content() {
    return `
    <p>${this.message}</p>`
  }

  Notify() {
    const div = DOMUtils.create.div;
    const id = `${Math.floor(Math.random()*200)}-${Math.floor(Math.random()*100)}-${Math.floor(Math.random()*100)}`

    div.setAttribute('id', id);
    div.setAttribute('class', 'toast text-bg-danger');
    div.setAttribute('role', 'alert');
    div.setAttribute('aria-live', 'assertive');
    div.setAttribute('aria-atomic', 'true');
    div.setAttribute('data-bs-autohide', 'true');
    div.setAttribute('style', 'z-index: 1060'); // Ensure it appears above the modal

    div.innerHTML = `
        <div class="toast-header text-bg-danger border-0">
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" style="font-size: 1.5rem; color: white">
          ${this.content()}
        </div>
    `;
    this.container.appendChild(div);
    DOMInterface.toast.show(id);
  }
}
