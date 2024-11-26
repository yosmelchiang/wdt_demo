export function createToast(type, toastData) {
  const toastContainer = document.getElementsByClassName('toast-container')[0];
  const toast = document.createElement('div');

  if (type === 'staff') {
    toast.innerHTML = `
    <div id="${toastData.id}" class="toast text-bg-danger border-0 p-3 mb-3 role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header text-bg-danger border-0">
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
        <img src="${toastData.picture}" alt="Staff Picture">
        <p>${toastData.name} ${toastData.surname} is late!</p>
        <p>${toastData.message}</p>
        </div>
    </div>
    `;
  } else if (type === 'delivery') {
    toast.innerHTML = `
    <div id="${toastData.id}" class="toast text-bg-danger border-0 p-3 mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header text-bg-danger border-0">
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        <p>${toastData.name} ${toastData.surname} is late!</p>
        <p>Return time was: ${toastData.return}</p>
        <p>Phone number: ${toastData.phone}</p>
        <p>Adress: ${toastData.adress}</p>
        <p>${toastData.message}</p>
    </div>
    </div>
`;
  }
  toastContainer.appendChild(toast);

  //Activate and show Bootstrap Toast
  const toastWindow = document.getElementById(`${toastData.id}`);
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWindow);
  toastBootstrap.show();

  toastWindow.addEventListener('hidden.bs.toast', () => {
    toast.remove(); //Removes the created DOM element once the toast has faded or closed manually by the user
  });
}
