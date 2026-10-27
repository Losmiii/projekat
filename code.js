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





let fields = [
    { input: titleInput, message: 'Please enter Title' },
    { input: priorityInput, message: 'Please choose Pio' },
    { input: statusInput, message: 'Please choose status' },
    { input: createdByInput, message: 'Please enter who created the task' },
    { input: dateAssignedInput, message: 'Please enter date ' },
    { input: dueDateInput, message: 'Please enter date' }
];

function clearErrors() {
    modal.querySelectorAll('.error').forEach(el => el.remove());
    fields.forEach(f => f.input.classList.remove('invalid'));
}

function clearFields() {
    fields.forEach(f => f.input.value = '');
}


fields.forEach(({ input }) => {
    let removeError = () => {
        input.classList.remove('invalid');
        let next = input.nextElementSibling;
        if (next && next.classList.contains('error')) {
            next.remove();
        }
    };
    input.addEventListener('input', removeError);
    input.addEventListener('change', removeError);
});

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


modal.addEventListener('close', () => {
    clearErrors();
});

addToTableBtn.addEventListener('click', () => {
    clearErrors();
    let valid = true;

    fields.forEach(({ input, message }) => {
        if (input.value.trim() === '') {
            input.classList.add('invalid');
            input.insertAdjacentHTML('afterend', `<small class="error">${message}</small>`);
            valid = false;
        }
    });

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