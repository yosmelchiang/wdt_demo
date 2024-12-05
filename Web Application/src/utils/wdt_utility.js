import { fetchAdressFromCoords } from '../api/wdt_api.js';

export const DOMInterface = {
  popover: null,

  //Getters
  async getDuration() {
    while (true) {
      const input = await this.customPrompt(
        'Please enter the number of minutes the staff member will be out'
      );

      if (input === null) {
        return null; //Return null back to staffOut if the user cancels
      }
      return parseInt(input);
    }
  },

  //Methods
  isInvalidDuration(input) {
    if (input === null) {
      return true;
    }
    return input.trim() === '' || isNaN(input) || input <= 0;
  },

  validateDelivery(instance) {
    const { name, surname, phone, adress, expectedRTime } = instance;
    let errorMessage = '';

    const invalidName = name.trim() === '' || !isNaN(name);
    const invalidSurname = surname.trim() === '' || !isNaN(surname);
    const invalidPhone = phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
    const invalidAdress = adress.trim() === '';
    const invalidReturnTime = expectedRTime.trim() === ''

    if (invalidName) {
      errorMessage = 'Name cannot be a number or empty.';
    } else if (invalidSurname) {
      errorMessage = 'Surname cannot be a number or empty.';
    } else if (invalidPhone) {
      errorMessage = 'Phone cannot be empty.';
    } else if (invalidAdress) {
      errorMessage = 'Adress cannot be empty';
    } else if (invalidReturnTime) {
      errorMessage = 'Return time cannot back in time or empty';
    }

    return errorMessage;
  },

  createToast(id) {
    const toastWindow = document.getElementById(`${id}`);
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
    toastBootstrap.show();

    toastWindow.addEventListener('hidden.bs.toast', () => {
      toastWindow.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
    });
  },

  customPrompt(message) {
    return new Promise((resolve) => {
      const { promptContainer, promptSubmit, promptCancel, promptField } = DOMUtils.DOM.ui;

      const prompt = new bootstrap.Modal(promptContainer)
      document.getElementById('customPromptLabel').innerText = message;

      prompt.show();

      const submitPrompt = () => {
        const userInput = promptField.value;
        if (!this.isInvalidDuration(userInput)) {
          promptSubmit.removeEventListener('click', submitPrompt);
          prompt.hide();
          resolve(userInput);
          promptField.value = '';
        } else {
          alert('Invalid input, try again');
          promptField.value = '';
        }
      };

      const cancelPrompt = () => {
        prompt.hide();
        resolve(null);
      }

      promptSubmit.addEventListener('click', submitPrompt);
      promptCancel.addEventListener('click', cancelPrompt);

      promptContainer.addEventListener('hidden.bs.modal', () => {
        resolve(null);
      })

    });
  },

  createPopOver(element) {
    const popover = new bootstrap.Popover(element, {
      trigger: 'manual', // We'll control when it shows and hides
      content: ``
    });

    return popover;
  }
};

export const DOMUtils = {
  DOM: null,

  init() {
    //GET DOM elements
    this.DOM = this.getDOMElements;
    console.log(
      Object.keys(this.DOM).length > 0
        ? 'DOM: Elements successfully loaded'
        : 'Error while loading DOM elements'
    );
  },

  //Getters
  get getDOMElements() {
    return {
      staff: {
        sTable: document.getElementById('staff').getElementsByTagName('tbody')[0],
        inBtn: document.getElementById('btn-in'),
        outBtn: document.getElementById('btn-out')
      },

      schedule: {
        vehicle: document.getElementById('schedule').getElementsByTagName('select'),
        inputs: document.getElementById('schedule').getElementsByTagName('input')
      },

      delivery: {
        dTable: document.getElementById('delivery').getElementsByTagName('tbody')[0],
        addBtn: document.getElementById('btn-add'),
        clearBtn: document.getElementById('btn-clear')
      },

      ui: {
        clock: document.getElementById('dateAndTime'),
        toastContainer: document.getElementsByClassName('toast-container')[0],
        formInputs: document.querySelectorAll('#schedule input'),
        promptContainer: document.getElementById('customPrompt'),
        promptSubmit: document.getElementById('modalSubmit'),
        promptCancel: document.getElementById('modalCancel'),
        promptField: document.getElementById('modalInput')
      }
    };
  },

  get createDiv() {
    return document.createElement('div');
  },

  get createRow() {
    return document.createElement('tr');
  },

  //Setters
  set updateStaff(JSObject) {
    const { row, staffInstance } = JSObject;
    const { status, outTime, duration, expectedRTime } = staffInstance;
    const values =
      status === 'Out' ? [status, outTime, duration, expectedRTime] : [status, '', '', ''];

    for (let i = 0; i < values.length; i++) {
      row.cells[i + 4].innerHTML = values[i];
    }
  },

  //Methods
  enableStaffSelection() {
    const rows = this.getDOMElements.staff.sTable.getElementsByTagName('tr');
    for (const row of rows) {
      row.addEventListener('click', function () {
        this.classList.toggle('selectedRow');
      });
    }
  },

  enableDeliverySelection() {
    const rows = this.getDOMElements.delivery.dTable.getElementsByTagName('tr');
    for (const row of rows) {
      const isDelivery = row.hasAttribute('deliveryRow'); //New rows wont have this attribute, so we set it
      if (!isDelivery) {
        //Should be false, meaning we enter this code block
        row.addEventListener('click', function () {
          //a newly created row as been clicked, so we add the class to it
          this.classList.toggle('selectedRow');
        });
      }
      row.setAttribute('deliveryRow', 'true');
    }
  },

  enableEnterKeySubmit() {
    const formInputs = this.getDOMElements.ui.formInputs;
    const addBtn = this.getDOMElements.delivery.addBtn;
    for (const input of formInputs) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          addBtn.click();
        }
      });
    }
  },

  getRowId(row) {
    const name = row.getElementsByTagName('td')[1].innerText;
    const surname = row.getElementsByTagName('td')[2].innerText;
    return name + '.' + surname;
  },

  populateStaff(instance) {
    const { picture, name, surname, email, status, outTime, duration, expectedRTime } = instance;
    const sTable = this.getDOMElements.staff.sTable;
    const row = this.createRow;

    if (instance !== undefined) {
      row.innerHTML = `
    <td><img src="${picture}" alt="Staff Picture"></td>
    <td>${name}</td>
    <td>${surname}</td>
    <td>${email}</td>
    <td>${status}</td>
    <td>${outTime}</td>
    <td>${duration}</td>
    <td>${expectedRTime}</td>      
      `;
    }
    sTable.appendChild(row);
  },

  populateDeliveries(instance) {
    const { vehicle, name, surname, phone, adress, expectedRTime } = instance;
    const dTable = this.getDOMElements.delivery.dTable;
    const row = this.createRow;

    if (instance !== undefined) {
      row.innerHTML = `
    <td>${vehicle}</td>
    <td>${name}</td>
    <td>${surname}</td>
    <td>${phone}</td>
    <td>${adress}</td>
    <td>${expectedRTime || ''}</td>
      `;
    }
    dTable.appendChild(row);
  }
};

export const MapFeatures = {
  DOM: null, //Where we will be storing our DOM elements, only relevant to the map features
  mapInstance: null, // Where we will be storing our map instance each time its created
  popover: null,

  init() {
    //Check if DOM elements have loaded
    this.DOM = this.getDOMElements;
    console.log(
      Object.keys(this.DOM).length > 0 ? 'Map: features loaded' : 'Map: features not loaded'
    );

    //Enable map buttons
    this.mapButtons();

    //Listeners
    this.addListeners();

    //Create a popover
    this.popover = DOMInterface.createPopOver(this.DOM.adressInput);
  },

  //Getters
  get getDOMElements() {
    return {
      locBtn: document.getElementById('btn-location'),
      mapBtn: document.getElementById('btn-map'),
      mapDiv: document.getElementById('map'),
      adressInput: document.getElementById('sch-adress'),
      useAdressBtn: document.getElementById('use-address')
    };
  },

  //Methods
  addListeners() {
    const { mapBtn, locBtn, adressInput } = this.DOM;

    locBtn.addEventListener('click', () => this.getUserLocation());
    mapBtn.addEventListener('click', () => this.getMap());
    adressInput.addEventListener('focus', () => {
      this.popover.show();
    });
    adressInput.addEventListener('blur', () => {
      this.popover.hide();
    });
  },

  mapButtons() {
    const { locBtn, mapBtn } = this.DOM;
    if (locBtn.style.display === 'none' || mapBtn.style.display === 'none') {
      locBtn.style.display = 'inline';
      mapBtn.style.display = 'inline';
    }
  },

  getUserLocation() {
    const { adressInput } = this.DOM;

    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position,
        { latitude, longitude } = coords;

      fetchAdressFromCoords({ latitude, longitude }).then((data) => (adressInput.value = data));
    });
  },

  getMap() {
    const { mapDiv } = this.DOM;

    if (mapDiv.style.display === 'flex') {
      mapDiv.style.display = 'none';
    } else {
      mapDiv.style.display = 'flex';
      if (!this.mapInstance) {
        // Creating a map instance
        this.mapInstance = L.map('map').setView([60.3954816, 5.3377375], 13);

        // Creating tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.mapInstance);

        this.mapInstance.on('tileerror', (error) => {
          console.log('Something went wrong loading tiles', error);
        });

        this.mapInstance.invalidateSize(); //Since we are hiding/showing our map, this will ensure proper recalculation of map size

        this.GeoSearch();
      }
    }
  },

  GeoSearch() {
    const { adressInput } = this.DOM;

    const search = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
      style: 'bar'
    });

    this.mapInstance.addControl(search);

    this.mapInstance.on('geosearch/showlocation', (result) => {
      const { location } = result;
      const { x: longitude, y: latitude } = location;

      const marker = result.marker;
      const adress = result.location.label;

      marker.bindPopup(`
            <div>
              <p>${adress}</p>
              <button id="use-address" style="cursor: pointer; color: blue; text-decoration: underline; background: none; border: none;">
                Use this address
              </button>
            </div>
          `);

      marker.openPopup();

      //Waits a second, to ensure DOM is updated.
      setTimeout(() => {
        const useAdressBtn = document.getElementById('use-address');

        if (useAdressBtn) {
          useAdressBtn.addEventListener('click', () => {
            fetchAdressFromCoords({ latitude, longitude }).then((data) => {
              adressInput.value = data; // Plots in the adress into the form input
              this.getMap(); //Closes the map
            });
          });
        }
      }, 100);
    });
  }
};
