import { factory } from '../classes/wdt_factory.js';
import { DOMUtils } from './DOMUtils.js';

export const DOMInterface = {
  //Properties
  toast: {
    activeToasts: {},

    create(type, toastData) {
      let toastInstance;
      switch (type) {
        case 'staff':
          toastInstance = factory.createEmployee('staffNotification', toastData);
          toastInstance.Notify();
          break;
        case 'delivery':
          toastInstance = factory.createEmployee('deliveryNotification', toastData);
          toastInstance.Notify();
          break;
        case 'system':
          toastInstance = factory.createEmployee('systemNotification', toastData);
          toastInstance.Notify();
          break;
        default:
      }
    },

    show(id, callback) {
      const toastWindow = document.getElementById(`${id}`);
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
      toastBootstrap.show();

      this.activeToasts[id] = toastWindow; //Tracking the active toasts we are showing to the user

      toastWindow.addEventListener('hidden.bs.toast', () => {
        delete this.activeToasts[id]; //Remove from the active toasts object
        toastWindow.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
        if (callback) callback(); //So we can clear the interval is the notification is hidden/manually closed
      });
    },

    update(id, message) {
      const toastWindow = this.activeToasts[id];
      if (toastWindow) {
        const body = toastWindow.querySelector('.toast-body');
        body.innerHTML = message;
      }
    }
  },

  prompt: {
    async getDuration() {
      const input = await this.customPrompt(
        'Please enter the number of minutes the staff member will be out'
      );

      if (input === null) {
        return null; //Return null back to staffOut if the user cancels
      }

      const duration = parseInt(input);
      return isNaN(duration) ? null : duration;
    },

    isInvalidDuration(input) {
      if (input === null) {
        return true;
      }

      const trimmedInput = String(input).trim(); //Making sure the input is a string
      const parsedInput = parseInt(trimmedInput, 10); //Making sure to parse as a number
      return trimmedInput === '' || isNaN(input) || parsedInput <= 0;
    },

    customPrompt(message) {
      return new Promise((resolve) => {
        const { promptContainer, promptSubmit, promptCancel, promptField } = DOMUtils.DOM.ui;

        const prompt = new bootstrap.Modal(promptContainer, {
          backdrop: 'static', //Prevent the user to click outside of the modal to exit
          keyboard: false //Prevent the user to click ESC to exit
        });

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
            DOMInterface.toast.create('system', { message: 'Invalid input, try again' });
            promptField.value = '';
          }
        };

        const cancelPrompt = () => {
          prompt.hide();
          resolve(null);
        };

        promptSubmit.addEventListener('click', submitPrompt);
        promptCancel.addEventListener('click', cancelPrompt);

        promptContainer.addEventListener('shown.bs.modal', () => {
          promptField.focus();
          DOMUtils.interact.useEnterToSubmit(promptField, promptSubmit);
        });

        promptContainer.addEventListener('hidden.bs.modal', () => {
          promptSubmit.removeEventListener('click', submitPrompt);
          promptCancel.removeEventListener('click', cancelPrompt);
          resolve(null);
        });
      });
    }
  },

  input: {
    validate(instance) {
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
    }
  }
};
