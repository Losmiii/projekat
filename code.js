let modal = document.querySelector('#modal');
let openTaskBtn = document.querySelector('.new-task-button');
let addToTableBtn = document.querySelector('#addToTable');
let cancelBtn = document.querySelector('#cancel');
let table = document.querySelector('table');
let tbody = document.querySelector('table tbody');




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




function saveTableToLocalStorage() {
    const rows = tbody.querySelectorAll('tr');
    const tableData = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        tableData.push({
            title: cells[0].textContent,
            priority: cells[1].textContent,
            status: cells[2].textContent,
            createdBy: cells[3].textContent,
            dateAssigned: cells[4].textContent,
            dueDate: cells[5].textContent
        });
    });

    localStorage.setItem('savedTableData', JSON.stringify(tableData));
}



function loadTableFromLocalStorage() {
    const storedData = localStorage.getItem('savedTableData');

    if (!storedData) {
        return;
    }

    const tableData = JSON.parse(storedData);
    tbody.innerHTML = '';

    tableData.forEach(item => {
        addRow(item);
    });
}



function addRow(item) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${item.title}</td>
        <td class="priority">${item.priority}</td>
        <td>${item.status}</td>
        <td>${item.createdBy}</td>
        <td>${item.dateAssigned}</td>
        <td>${item.dueDate}</td>
        <td>
            <div class="table-icons">
                <img src="assets/imgs/file-arrow-down-solid-full.svg" alt="">
                <img src="assets/imgs/pen-to-square-solid-full.svg" alt="">
                <img src="assets/imgs/trash-can-solid-full.svg" alt="">
            </div>
        </td>
    `;

    tbody.appendChild(row);
}

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

function filterTasks() {
    const data = JSON.parse(localStorage.getItem('savedTableData')) || [];
    console.log(data);
}

// brisanje reda
table.addEventListener('click', (e) => {
    if (e.target.matches('img[src*="trash-can"]')) {
        e.target.closest('tr').remove();
        saveTableToLocalStorage();
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
        priorityError.textContent = priority === '' ? 'please choose priority' : '';
        statusError.textContent = status === '' ? 'please choose status' : '';
        createdByError.textContent = createdBy === '' ? 'please enter creator' : '';
        dateAssignedError.textContent = dateAssigned === '' ? 'please enter date' : '';
        dueDateError.textContent = dueDate === '' ? 'please enter date' : '';

        titleInput.classList.toggle('invalid', title === '');
        priorityInput.classList.toggle('invalid', priority === '');
        statusInput.classList.toggle('invalid', status === '');
        createdByInput.classList.toggle('invalid', createdBy === '');
        dateAssignedInput.classList.toggle('invalid', dateAssigned === '');
        dueDateInput.classList.toggle('invalid', dueDate === '');

        return;
    }

    addRow({ title, priority, status, createdBy, dateAssigned, dueDate });
    saveTableToLocalStorage();

    clearFields();
    modal.close();
});


loadTableFromLocalStorage();