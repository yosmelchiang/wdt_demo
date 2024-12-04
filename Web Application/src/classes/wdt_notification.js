import { DOMUtils } from '../utils/wdt_utility.js';
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
    div.innerHTML = `
      <div id="${
        this.id
      }" class="toast text-bg-danger role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header text-bg-danger border-0">
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${this.content()}
        </div>
      </div>
    `;
    this.container.appendChild(div);
    DOMUtils.createToast(this.id);
  }
}

// #region Staff Notification
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
// #endregion

// #region Delivery Notification
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

export class SystemNotification extends Notification {
  constructor(JSObject) {
    super(JSObject);
  }

  content() {
    return `
    whatever
    `
  }
}
// #endregion
