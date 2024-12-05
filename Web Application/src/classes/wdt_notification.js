import { DOMInterface, DOMUtils } from '../utils/wdt_utility.js';

class Notification {
  constructor(JSObject) {
    this.container = DOMUtils.getDOMElements.ui.toastContainer;
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
    const div = DOMUtils.createDiv;

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
    DOMInterface.createToast(this.id);
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
