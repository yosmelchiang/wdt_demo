import { fetchAdressFromCoords } from '../api/wdt_api.js';

export const DOMInterface = {
  //Getters
  async getDuration() {
    const input = await this.customPrompt( {
      message: 'Please enter the number of minutes the staff member will be out',
      validateInput: (input) => !this.isInvalidDuration(input),
      onInvalidInput: () => alert('Invalid duration, please try again'),
      placeholder: 'Enter minutes'

    })
    return input !== null ? parseInt(input) : null;
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
    const invalidReturnTime = expectedRTime.trim() === '';

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

  customPrompt( {
    message,
    validateInput = null,
    onInvalidInput = null,
    placeholder = '',
    submitLabel = 'Submit',
    cancelLabel = 'Cancel'
  }) {
    return new Promise((resolve) => {
      //DOM elements
      const { promptContainer, promptSubmit, promptCancel, promptField, promptBody } = DOMUtils.DOM.ui;

      //Creatong a bootstrap modal
      const prompt = new bootstrap.Modal(promptContainer, {
        backdrop: 'static', //prevents closing when clicking outside of the modal
        keyboard: false //Disabling pressing the ESC button to close the modal
      });

      //Setting up the UI elements
      document.getElementById('customPromptLabel').innerText = message;
      promptField.placeholder = placeholder;
      promptSubmit.innerText = submitLabel;
      promptCancel.innerText = cancelLabel;

      //Disable promptField if no input is needed (confirmation mode)
      if(!validateInput) {
        promptBody.style.display = 'none' //Hide the field
        promptField.style.display = 'none' //Hide the field
      } else {
        promptBody.style.display = ''; //Show the field
        promptField.style.display = ''; //Show the field
      }

      //Showing the modal
      prompt.show();

      const submitPrompt = () => {
        const userInput = promptField.value;
        
        if(validateInput) {
          if(validateInput(userInput)) {
            clear();
            resolve(userInput);
          } else if(onInvalidInput){
            onInvalidInput(userInput); //Call invalid input if needed
            promptField.value = ''; //Clear the inputs
          } 
        } else {
          clear();
          resolve(true); //For comfirmation prompts
        }
      };

      const cancelPrompt = () => {
        clear();
        resolve(null);
      };

      //Clear and remove listeners
      const clear = () => {
        promptSubmit.removeEventListener('click', submitPrompt);
        promptCancel.removeEventListener('click', cancelPrompt);
        promptContainer.removeEventListener('hidden.bs.modal', clear)
        promptField.value= ''; //Reset input
        prompt.hide();

        const backdrop = document.querySelector('.modal-backdrop');
        if(backdrop) backdrop.remove();
      }

      //Event listeners
      promptSubmit.addEventListener('click', () => {
        submitPrompt();
      });
      promptCancel.addEventListener('click', () => {
        cancelPrompt();
      });

      promptContainer.addEventListener('hidden.bs.modal', () => {
        clear()
      });

      promptContainer.addEventListener('shown.bs.modal', () => {
        promptField.focus();
        DOMUtils.useEnterToSubmit(promptField, promptSubmit);
      });
    });
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
        employeeToastContainer: document.getElementsByClassName('employee-toast-container')[0],
        systemToastContainer: document.getElementsByClassName('system-toast-container')[0],
        formInputs: document.querySelectorAll('#schedule input'),
        promptContainer: document.getElementById('customPrompt'),
        promptSubmit: document.getElementById('modalSubmit'),
        promptCancel: document.getElementById('modalCancel'),
        promptField: document.getElementById('modalInput'),
        promptBody: document.getElementById('modalBody')
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

  useEnterToSubmit(input, submitBtn) {
    if (Object.keys(input).length > 0) {
      for (const field of input) {
        field.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            submitBtn.click();
          }
        });
      }
    } else {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitBtn.click();
        }
      });
    }

    const addBtn = this.getDOMElements.delivery.addBtn;
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
