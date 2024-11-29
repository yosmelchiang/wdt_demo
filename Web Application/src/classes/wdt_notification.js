class Notification {
  constructor(JSObject) {
    this.container = JSObject.container;
    this.id = JSObject.id;
    this.name = JSObject.name;
    this.surname = JSObject.surname;
    this.message = JSObject.message;
  }
}

// #region Staff Notification
export class StaffNotification extends Notification {
  constructor(JSObject) {
    super(JSObject);
    this.container = JSObject.container;
    this.id = JSObject.id;
    this.name = JSObject.name;
    this.surname = JSObject.surname;
    this.message = JSObject.message;
    this.picture = JSObject.picture;
  }


  Notify() {
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div id="${this.id}" class="toast text-bg-danger border-0 p-3 mb-3 role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
            <div class="toast-header text-bg-danger border-0">
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
            <img src="${this.picture}" alt="Staff Picture">
            <p>${this.name} ${this.surname} is late!</p>
            <p>${this.message}</p>
            </div>
        </div>
        `;
    this.container.appendChild(toast);

    //Activate and show Bootstrap Toast
    const toastWindow = document.getElementById(`${this.id}`);
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
    toastBootstrap.show();

    toastWindow.addEventListener('hidden.bs.toast', () => {
      toast.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
    });
  }
}
// #endregion

// #region Delivery Notification
export class DeliveryNotification extends Notification {
    constructor(JSObject) {
        super(JSObject)
        this.container = JSObject.container;
        this.id = JSObject.id;
        this.name = JSObject.name;
        this.surname = JSObject.surname;
        this.message = JSObject.message;
        this.phone = JSObject.phone;
        this.adress = JSObject.adress;
        this.return = JSObject.return;
    }

    Notify() {
        const toast = document.createElement('div');
        toast.innerHTML = `
        <div id="${this.id}" class="toast text-bg-danger border-0 p-3 mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header text-bg-danger border-0">
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <p>${this.name} ${this.surname} is late!</p>
            <p>Return time was: ${this.return}</p>
            <p>Phone number: ${this.phone}</p>
            <p>Adress: ${this.adress}</p>
            <p>${this.message}</p>
        </div>
        </div>
        `;
        this.container.appendChild(toast);
    
        //Activate and show Bootstrap Toast
        const toastWindow = document.getElementById(`${this.id}`);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
        toastBootstrap.show();
    
        toastWindow.addEventListener('hidden.bs.toast', () => {
          toast.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
        });
    }
}
// #endregion