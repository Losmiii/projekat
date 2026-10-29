let modal = document.querySelector('#modal');
let openTaskBtn = document.querySelector('.new-task-button');
let addToTableBtn = document.querySelector('#addToTable');
let cancelBtn = document.querySelector('#cancel');
let table = document.querySelector('table');
let tbody = document.querySelector('table tbody');
 
 
 
let titleInput = document.querySelector('#title');
let priorityInput = document.querySelector('#priority');
let statusInput = document.querySelector('#filterStatus');
let createdByInput = document.querySelector('#createdBy');
let dateAssignedInput = document.querySelector('#dateAssigned');
let dueDateInput = document.querySelector('#dueDate');
let statusCreateTaskInput = document.querySelector('#status');
 
let titleError = document.querySelector('#titleError');
let priorityError = document.querySelector('#priorityError');
let statusError = document.querySelector('#statusError');
let createdByError = document.querySelector('#createdByError');
let dateAssignedError = document.querySelector('#dateAssignedError');
let dueDateError = document.querySelector('#dueDateError');
 
let filterDateAssignedInput = document.querySelector('#filterDateAssigned');
let filterDueDateInput = document.querySelector('#filterDueDate');
 
 
let deleteModal = document.querySelector('#deleteModal');
let confirmDeleteBtn = document.querySelector('#confirmDelete');
let cancelDeleteBtn = document.querySelector('#cancelDelete');
let rowToDelete = null;
 
function saveTableToLocalStorage() {
    const rows = tbody.querySelectorAll('tr');
    const tableData = [];
 
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
 

        const val = (i) => row.classList.contains('editing')
            ? cells[i].dataset.original
            : cells[i].textContent;
 
        tableData.push({
            title: val(0),
            priority: val(1),
            status: val(2),
            createdBy: val(3),
            dateAssigned: val(4),
            dueDate: val(5)
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
                <img class="delete-icon" src="assets/imgs/trash-can-solid-full.svg" alt="">
            </div>
        </td>
    `;
 
    tbody.appendChild(row);
}
 
 
function startEdit(row) {
    if (row.classList.contains('editing')) return;
    row.classList.add('editing');
 
    const cells = row.querySelectorAll('td');
 
    for (let i = 0; i < 6; i++) {
        const value = cells[i].textContent;
        cells[i].dataset.original = value;
 
        let field;
        if (i === 1) {
            // priority: kopiramo opcije iz modala
            field = document.createElement('select');
            field.innerHTML = priorityInput.innerHTML;
        } else if (i === 2) {
            // status: kopiramo opcije iz modala
            field = document.createElement('select');
            field.innerHTML = statusCreateTaskInput.innerHTML;
        } else {
            field = document.createElement('input');
            field.type = (i === 4 || i === 5) ? 'date' : 'text';
        }
 
        field.value = value;
        cells[i].textContent = '';
        cells[i].appendChild(field);
    }
 
    // sačuvamo ikonice da ih posle vratimo
    cells[6].dataset.original = cells[6].innerHTML;
    cells[6].innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}
 
 
function finishEdit(row, save) {
    const cells = row.querySelectorAll('td');
 
    if (save) {

        for (let i = 0; i < 6; i++) {
            if (cells[i].firstElementChild.value.trim() === '') {
                alert('Sva polja moraju biti popunjena.');
                return;
            }
        }
    }
 
    for (let i = 0; i < 6; i++) {
        cells[i].textContent = save
            ? cells[i].firstElementChild.value.trim()
            : cells[i].dataset.original;
    }
 
    cells[6].innerHTML = cells[6].dataset.original;
    row.classList.remove('editing');
 
    if (save) {
        saveTableToLocalStorage();
    }
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
    const statusFilter = statusInput.value;
    const dateAssignedFilter = filterDateAssignedInput.value;
    const dueDateFilter = filterDueDateInput.value;
 
    const filteredData = data.filter(item => {
        const matchesStatus =
            statusFilter === '' ||
            item.status.toLowerCase() === statusFilter.toLowerCase();
 
        const matchesDateAssigned =
            dateAssignedFilter === '' ||
            item.dateAssigned === dateAssignedFilter;
 
        const matchesDueDate =
            dueDateFilter === '' ||
            item.dueDate === dueDateFilter;
 
        return matchesStatus && matchesDateAssigned && matchesDueDate;
    });
 
 
    tbody.innerHTML = '';
 
    filteredData.forEach(item => {
        addRow(item);
    });
}
 
 
 
 
 
table.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
 
    if (e.target.matches('img[src*="trash-can"]')) {
        rowToDelete = row;
        deleteModal.showModal();
    }
 
    if (e.target.matches('img[src*="pen-to-square"]')) {
        startEdit(row);
    }
 
    if (e.target.matches('.save-btn')) {
        finishEdit(row, true);
    }
 
    if (e.target.matches('.cancel-btn')) {
        finishEdit(row, false);
    }
});
 
confirmDeleteBtn.addEventListener('click', () => {
    if (rowToDelete) {
        rowToDelete.remove();
        saveTableToLocalStorage();
        rowToDelete = null;
    }
    deleteModal.close();
});
 
cancelDeleteBtn.addEventListener('click', () => {
    rowToDelete = null;
    deleteModal.close();
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
    let status = statusCreateTaskInput.value;
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
        statusCreateTaskInput.classList.toggle('invalid', status === '');
        createdByInput.classList.toggle('invalid', createdBy === '');
        dateAssignedInput.classList.toggle('invalid', dateAssigned === '');
        dueDateInput.classList.toggle('invalid', dueDate === '');
 
        return;
    }
 
    addRow({
        title,
        priority,
        status,
        createdBy,
        dateAssigned,
        dueDate
    });
    saveTableToLocalStorage();
 
    clearFields();
    modal.close();
});
 
 
loadTableFromLocalStorage();