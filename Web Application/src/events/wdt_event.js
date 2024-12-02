// #region ROW SELECTION
/**
 * @description - This function applies a specific class for mouse selected rows, that will be used for styling as well as an element identifier.
 * @function staffRowSelection - Uses a simple for of loop to iterate all the rows and add a class to it that
 * we can use for styling as well as DOM manipulation when interacting with the table.
 */
export function enableRowSelection(table, type) {
  const rows = table.getElementsByTagName('tr');

  if (type === 'staff') {
    for (const row of rows) {
      row.addEventListener('click', function () {
        this.classList.toggle('selectedRow');
      });
    }
  } else if (type === 'delivery') {
    for (const row of rows) {
      const delivery = row.hasAttribute('deliveryRow');

      if (!delivery) {
        row.addEventListener('click', function () {
          this.classList.toggle('selectedRow');
        });
        row.setAttribute('deliveryRow', 'true');
      }
    }
  }
}
// #endregion

// #region Schedule Delivery Form Input Listener
export function formEnterKeyListener(addBtn) {
  const formInputs = document.querySelectorAll('#schedule input');
  for (const input of formInputs) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addBtn.click();
      }
    });
  }
}
// #endregion
