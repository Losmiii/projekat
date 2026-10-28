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




function clearErrors() {
    titleError.textContent = '';
    priorityError.textContent = '';
    statusError.textContent = '';
    createdByError.textContent = '';
    dateAssignedError.textContent = '';
    dueDateError.textContent = '';

    titleInput.classList.remove('invalid');
    priorityInput.classList.remove('invalid');
    statusInput.classList.remove('invalid');
    createdByInput.classList.remove('invalid');
    dateAssignedInput.classList.remove('invalid');
    dueDateInput.classList.remove('invalid');
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
if (saved) {
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
    let title = titleInput.value.trim();
    let priority = priorityInput.value;
    let status = statusInput.value;
    let createdBy = createdByInput.value.trim();
    let dateAssigned = dateAssignedInput.value;
    let dueDate = dueDateInput.value;

    clearErrors();

    if (title === '' || priority === '' || status === '' || createdBy === '' || dateAssigned === '' || dueDate === '') {

        titleError.textContent = title === '' ? 'please enter title' : '';
        priorityError.textContent = priority === '' ? 'Please choose priority' : '';
        statusError.textContent = status === '' ? 'please choose status' : '';
        createdByError.textContent = createdBy === '' ? 'please enter  task' : '';
        dateAssignedError.textContent = dateAssigned === '' ? 'please enter date ' : '';
        dueDateError.textContent = dueDate === '' ? 'lease enter date' : '';

        titleInput.classList.toggle('invalid', title === '');
        priorityInput.classList.toggle('invalid', priority === '');
        statusInput.classList.toggle('invalid', status === '');
        createdByInput.classList.toggle('invalid', createdBy === '');
        dateAssignedInput.classList.toggle('invalid', dateAssigned === '');
        dueDateInput.classList.toggle('invalid', dueDate === '');

        return;
    }

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