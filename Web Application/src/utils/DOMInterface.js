import { factory } from '../classes/wdt_factory.js';
import { DOMUtils } from './DOMUtils.js';

/**
 * DOMInterface.js
 * Utility functions for managing UI components such as toasts, prompts, and input validations.
 * This module facilitates DOM manipulations and user interactions.
 */

export const DOMInterface = {
  //Properties
  toast: {
    activeToasts: {}, // This empty object hosts all the active Toasts that have been created, and are being updated by instance intervals

    /**
     * Creates a toast notification instance using the factory.
     * @param {String} type - Type of toast to create, for example staff, delivery or system.
     * @param {Object} toastData - Contains toast ID and content.
     */
    create(type, toastData) {
      let toastInstance;
      switch (type) {
        case 'staff':
        case 'system':
        case 'delivery':
          toastInstance = factory.createNotification(type, toastData);
          toastInstance.Notify();
          break;
        default:
      }
    },

    /**
     * Initiates bootstraps toast instance.
     * @param {String} id - An id created by the caller, we are using the ID to show the bootstrap toast div element.
     * @param {FN} callback - Callback function triggered once the toast notification has been hidden/closed.
     */
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

    /**
     * This function allows us to update our toast notification for as long as it exists in our activeToast object.
     * @param {String} id - We are using the toast DOM element ID to update its content.
     * @param {String} message - A concatenated string message.
     */
    update(id, message) {
      const toastWindow = this.activeToasts[id];
      if (toastWindow) {
        const body = toastWindow.querySelector('.toast-body');
        body.innerHTML = message;
      }
    }
  },

  prompt: {
    /**
     * We have decided to use a modal for this process instead of a traditional prompt.
     * Because bootstrap modals are asynchronous and start a transition, they take time. Therefore we are assigning this function as async.
     * Once we call the customPrompt, we are waiting for that call to finish so we can assign the value to input. Additinally we are also validating that the input is not null, and if it is, we are handling that case by returning null back to the caller of this function so they can deal with it.
     * Lastly, we parse the input to an integer, and make sure its a number before we return it back to the caller.
     * @returns {Number} - An integer representing the absence duration given.
     */
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

    /**
     * This is our main validator for the user absence duration.
     * @param {Number} input - A time duration given in minutes
     * @returns {Boolean} - isInvalidDuration returns either true or false for valid or invalid durations.
     */
    isInvalidDuration(input) {
      // Here we are checking the the input given is not null
      if (input === null) {
        return true;
      }

      const trimmedInput = String(input).trim(); //Making sure the input is a string
      const parsedInput = parseInt(trimmedInput); //Making sure to parse as a number
      return trimmedInput === '' || isNaN(input) || parsedInput <= 0; //If input is empty, a word of some sort or a negative number = true, else our validation will return false.
    },

    customPrompt(message) {
      return new Promise((resolve) => {
        // Creating a new promise tha thas to be resolved at some point.
        const { promptContainer, promptSubmit, promptCancel, promptField } = DOMUtils.DOM.ui,
          { toast } = DOMInterface;

        // Creating a bootstrap modal with our container element and an object with configurations.
        const prompt = new bootstrap.Modal(promptContainer, {
          backdrop: 'static', //Prevent the user to click outside of the modal to exit
          keyboard: false //Prevent the user to click ESC to exit
        });

        // Here we are assigning the custom message to a DOM element used on the modal.
        document.getElementById('customPromptLabel').innerText = message;

        prompt.show(); //Showing our modal

        const submitPrompt = () => {
          const userInput = promptField.value;
          if (!this.isInvalidDuration(userInput)) {
            //If our validation is not false, meaning its true, then we are good.
            promptSubmit.removeEventListener('click', submitPrompt);
            prompt.hide();
            resolve(userInput);
            promptField.value = '';
          } else {
            //If our validation returns a true, that means the input is wrong, we let the user know
            toast.create('system', { message: 'Invalid input, try again' });
            promptField.value = '';
          }
        };

        //Hides the modal if the user cancels it, and also resolve the promise with null
        const cancelPrompt = () => {
          prompt.hide();
          resolve(null);
        };

        // Creating Listeners for submit/cancel buttons but also for focus on field when the modal shows and some additional feature such as using the enter to submit. We are removing the listeners when the modal is closed.
        promptSubmit.addEventListener('click', submitPrompt);
        promptCancel.addEventListener('click', cancelPrompt);

        promptContainer.addEventListener('shown.bs.modal', () => {
          promptField.focus();
          DOMUtils.interact.useEnterToSubmit(promptField, promptSubmit);
        });

        // Making sure to clear up the listeners when the modal is closed
        promptContainer.addEventListener('hidden.bs.modal', () => {
          promptSubmit.removeEventListener('click', submitPrompt);
          promptCancel.removeEventListener('click', cancelPrompt);
          promptContainer.removeEventListener('shown.bs.modal', cancelPrompt);
          promptContainer.removeEventListener('hidden.bs.modal', cancelPrompt);
          resolve(null);
        });
      });
    }
  },

  input: {
    /**
     * This function is being used to validate an instance for propertie values. Since we are creating new deliveries dynamically. We want to make sure the properties are validated.
     * We go through each and one of the values to see that they are not empty or wrong type. If any of the validations become true, we return a string message to inform the user.
     * @param {Class} instance - Destructures class instance for name, surname, phone, adress and expectedRTime to validet those.
     * @returns {String} - A string sentence with the errorMessage.
     */
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
