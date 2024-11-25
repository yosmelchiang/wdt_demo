const addBtn = document.getElementById('btn-add');

// #region ROW SELECTION
/**
 * @description - This function applies a specific css styling class for mouse selected rows of staff table.
 * @function staffRowSelection - Uses a simple for loop to iterate all the rows and add a class to it that
 * we can use for styling as well as DOM manipulation when interacting with the table.
 */
export function enableRowSelection(table, type) {
  const rows = table.getElementsByTagName('tr');

  if (type === 'staffRow') {
    for (let i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function () {
        this.classList.toggle('selectedRow');
      });
    }
  } else if (type === 'deliveryRow') {
    for (let i = 0; i < rows.length; i++) {
      const delivery = rows[i].hasAttribute('deliveryRow');

      if (!delivery) {
        rows[i].addEventListener('click', function () {
          this.classList.toggle('selectedRow');
        });
        rows[i].setAttribute('deliveryRow', 'true');
      }
    }
  }
}
// #endregion

// #region Schedule Delivery Form Input Listener
export function formEnterKeyListener() {
  const formInputs = document.querySelectorAll('#schedule input');

  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addBtn.click();
      }
    });
  }
}
// #endregion
