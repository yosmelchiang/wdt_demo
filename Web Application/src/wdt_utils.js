export function validateInputs(JSObject) {
    let errorMessage = '';
    const invalidName = JSObject.name.trim() === '' || !isNaN(JSObject.name);
    const invalidSurname = JSObject.surname.trim() === '' || !isNaN(JSObject.surname);
    const invalidPhone = JSObject.phone.trim() === ''; //We dont need to validate if its a number as the HTML input type (Number) validates this for us
    const invalidAdress = JSObject.adress.trim() === '';
    const invalidReturnTime = JSObject.expectedRTime.trim() === '';
    
    if (invalidName) {
      errorMessage = 'Name cannot be empty or a number.';
    } else if (invalidSurname) {
      errorMessage = 'Surname cannot be empty or a number.';
    } else if (invalidPhone) {
      errorMessage = 'Phone cannot be empty or a number.';
    } else if (invalidAdress) {
      errorMessage = 'Adres cannot be empty';
    } else if (invalidReturnTime) {
      errorMessage = 'Return time cannot be empty';
    }
  
    return errorMessage;
  }