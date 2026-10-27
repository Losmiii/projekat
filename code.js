let modal = document.querySelector('#modal');
let openTaskBtn = document.querySelector('.new-task-button');
let addToTableBtn = document.querySelector('#addToTable');
let cancelBtn = document.querySelector('#cancel');
let table = document.querySelector('table');

let titleInput = document.querySelector('#title');
let priorityInput = document.querySelector('#priority');
let statusInput = document.querySelector('#status');
let createdByInput = document.querySelector('#createdBy');
let dateAssignedInput = document.querySelector('#dateAssigned');
let dueDateInput = document.querySelector('#dueDate');





let titleError = document.querySelector('#titleError');
let priorityError = document.querySelector('#priorityError');
let statusError = document.querySelector('#statusError');
let createdByError = document.querySelector('#createdByError');
let dateAssignedError = document.querySelector('#dateAssignedError');
let dueDateError = document.querySelector('#dueDateError');

function showError(input, errorEl, message) {
    input.classList.add('invalid');
    errorEl.textContent = message;
}

function clearError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
}

function clearErrors() {
    clearError(titleInput, titleError);
    clearError(priorityInput, priorityError);
    clearError(statusInput, statusError);
    clearError(createdByInput, createdByError);
    clearError(dateAssignedInput, dateAssignedError);
    clearError(dueDateInput, dueDateError);
}



function clearFields() {
    titleInput.value = '';
    priorityInput.value = '';
    statusInput.value = '';
    createdByInput.value = '';
    dateAssignedInput.value = '';
    dueDateInput.value = '';
}

let saved = localStorage.getItem('tasks-table');
if  (saved) {
     table.innerHTML = saved;
}

function save() {
      localStorage.setItem('tasks-table', table.innerHTML);
}


table.addEventListener('click', (e) => {
    if (e.target.matches('img[src*="trash-can"]')) {
        e.target.closest('tr').remove();
        save();
    }
});

openTaskBtn.addEventListener('click', () => {
    modal.showModal();
    titleInput.focus();
});

cancelBtn.addEventListener('click', () => {
    clearErrors();
    clearFields();
    modal.close();
});


modal.addEventListener('input', clearErrors);


modal.addEventListener('change', clearErrors);


modal.addEventListener('close', clearErrors);

addToTableBtn.addEventListener('click', () => {
    clearErrors();
    let valid = true;

    if (titleInput.value.trim() === '') {
        showError(titleInput, titleError, 'please enter Title');
        valid = false;
    }
    if (priorityInput.value === '') {
        showError(priorityInput, priorityError, 'plesa choose priority');
        valid = false;
    }
    if (statusInput.value === '') {
        showError(statusInput, statusError, 'Please choose status');
        valid = false;
    }
    if (createdByInput.value.trim() === '') {
        showError(createdByInput, createdByError, 'Please enter creator');
        valid = false;
    }
    if (dateAssignedInput.value === '') {
        showError(dateAssignedInput, dateAssignedError, 'Please enter date ');
        valid = false;
    }
    if (dueDateInput.value === '') {
        showError(dueDateInput, dueDateError, 'Please enter date');
        valid = false;
    }

    if (!valid) return;

    let title = titleInput.value;
    let priority = priorityInput.value;
    let status = statusInput.value;
    let createdBy = createdByInput.value;
    let dateAssigned = dateAssignedInput.value;
    let dueDate = dueDateInput.value;

    let template = `
        <tr>
            <td>${title}</td>
            <td class="priority">${priority}</td>
            <td>${status}</td>
            <td>${createdBy}</td>
            <td>${dateAssigned}</td>
            <td>${dueDate}</td>
            <td>
                <div class="table-icons">
                    <img src="assets/imgs/file-arrow-down-solid-full.svg" alt="">
                    <img src="assets/imgs/pen-to-square-solid-full.svg" alt="">
                    <img src="assets/imgs/trash-can-solid-full.svg" alt="">
                </div>
            </td>
        </tr>
    `;

    table.insertAdjacentHTML('beforeend', template);
    save();

    clearFields();
    modal.close();
});