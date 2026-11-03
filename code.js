//domom selektujem html i stavljam u neke promenljive da ne moram uvek da kucam document.queryselector
let modal = document.querySelector('#modal');
//dugme za otvaranje modala za novi task
let openTaskBtn = document.querySelector('.new-task-button');
//dugme add task unutar modala
let addToTableBtn = document.querySelector('#addToTable');
//dugme cancel unutar modala
let cancelBtn = document.querySelector('#cancel');
//cela tabela
let table = document.querySelector('table');
//telo tabele, tu idu redovi sa taskovima
let tbody = document.querySelector('table tbody');
 
 
 
//inputi iz modala za novi task
let titleInput = document.querySelector('#title');
let priorityInput = document.querySelector('#priority');
//ovo je select za filter statusa (ne iz modala)
let statusInput = document.querySelector('#filterStatus');
let createdByInput = document.querySelector('#createdBy');
let dateAssignedInput = document.querySelector('#dateAssigned');
let dueDateInput = document.querySelector('#dueDate');
//ovo je select za status iz modala
let statusCreateTaskInput = document.querySelector('#status');
 
//mesta gde ispisujem greske ispod inputa
let titleError = document.querySelector('#titleError');
let priorityError = document.querySelector('#priorityError');
let statusError = document.querySelector('#statusError');
let createdByError = document.querySelector('#createdByError');
let dateAssignedError = document.querySelector('#dateAssignedError');
let dueDateError = document.querySelector('#dueDateError');
 
//inputi za datume u filteru
let filterDateAssignedInput = document.querySelector('#filterDateAssigned');
let filterDueDateInput = document.querySelector('#filterDueDate');
 
 
//modal za potvrdu brisanja i njegova dva dugmeta
let deleteModal = document.querySelector('#deleteModal');
let confirmDeleteBtn = document.querySelector('#confirmDelete');
let cancelDeleteBtn = document.querySelector('#cancelDelete');
//ovde pamtim koji red treba da se obrise, na pocetku nijedan
let rowToDelete = null;

//trenutna strana koja se prikazuje, krece od prve
let currentPage = 1;
//koliko taskova se prikazuje po strani
let rowsPerPage = 5;
//leva i desna strelica u footeru
let prevPageBtn = document.querySelector('#prevPage');
let nextPageBtn = document.querySelector('#nextPage');
//tekst u footeru npr 1-5 of 10
let pageInfo = document.querySelector('#pageInfo');
 

//cuvam podatke u local storage
function saveTableToLocalStorage() {
    //u pormenljivu rows stavljam sve tr sem theadera
    const rows = tbody.querySelectorAll('tr');
    //pravim prazan array gde cu da cuvam podatke
    const tableData = [];
 
    //pravim loop koj prolazi kroz svaku celiju
    rows.forEach(row => {
        //uzimam sve td iz tog reda
        const cells = row.querySelectorAll('td');
 

        //ako se red edituje uzimam staru vrednost, ako ne uzimam tekst iz celije
        const val = (i) => row.classList.contains('editing')
            ? cells[i].dataset.original
            : cells[i].textContent;
 

            //pushujem podatke tjst dodajem
        tableData.push({
            title: val(0),
            priority: val(1),
            status: val(2),
            createdBy: val(3),
            dateAssigned: val(4),
            dueDate: val(5)
        });
    });
 
    //ovde prebacujem iz objekta u stringg i cuvam podatke u localstorage
    localStorage.setItem('savedTableData', JSON.stringify(tableData));
}
 
 //uctiva podatke iz localstorage
function loadTableFromLocalStorage() {

    //hvatam podatke iz local storaga sa get item i stavljam ih u stored data
    const storedData = localStorage.getItem('savedTableData');
 //ako nema podaci ne radi nista
    if (!storedData) {
        return;
    }
 //a ovde prebacujemmm iz stringa u objekat
    const tableData = JSON.parse(storedData);
//a ovde brisem sve iz tabele 
    tbody.innerHTML = '';
 

    //idem kroz podatke i dodajem u tabelu
    tableData.forEach(item => {
        addRow(item);
    });
}
 
 //fukncija za dodavanje reda

function addRow(item) {
    //selectujem row i stavljam ga u row
    const row = document.createElement('tr');
 
    //ovdee pravimm html 


    //sa item. dobijam podatke iz objekta i generisem html u tabeli
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
 
    //dodajem na kraju tabele
    tbody.appendChild(row);
}
 
 
//ovde editujem redove ako red sadrzi editing onda ne desava se nista
function startEdit(row) {
    if (row.classList.contains('editing')) return;
    //a ovde dodajem klasu editing rowu
    row.classList.add('editing');
 

    //selektujem sve celije
    const cells = row.querySelectorAll('td');
 

    //prolazim kroz sve celije i dodajem input polje ili select polje zavisi od indeksa
    for (let i = 0; i < 6; i++) {
        //uzimam trenutni tekst iz celije
        const value = cells[i].textContent;
        //pamtim ga u dataset da mogu da vratim ako kliknem cancel
        cells[i].dataset.original = value;
 

        //dodajem unput za prioriti
        let field;
        if (i === 1) {

            //pravim select i kopiram opcije iz modala za priority
            field = document.createElement('select');
            field.innerHTML = priorityInput.innerHTML;
        } else if (i === 2) {

            //za select
            field = document.createElement('select');
            field.innerHTML = statusCreateTaskInput.innerHTML;
        } else {
            //za prvi i drugi data
            field = document.createElement('input');
            field.type = (i === 4 || i === 5) ? 'date' : 'text';
        }
 

        //stavljam staru vrednost u polje
        field.value = value;
        //praznim celiju
        cells[i].textContent = '';
        //i ubacujem polje u celiju
        cells[i].appendChild(field);
    }
 

    //pamtim stare ikonice da ih vratim posle
    cells[6].dataset.original = cells[6].innerHTML;

    //dodajem dugmicee
    cells[6].innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}
 
 //ovde zavrsavam editovanjee
function finishEdit(row, save) {
    //selektujem celije
    const cells = row.querySelectorAll('td');
 //ako kliknem save prolazim kroz sve celije 
    if (save) {
//ako je polje prazmo ne dajem da se sacuva
        for (let i = 0; i < 6; i++) {
            if (cells[i].firstElementChild.value.trim() === '') {

                return;
            }
        }
    }
 
    //ako je save stavljam novu vrednost u celiju, ako nije vracam staru
    for (let i = 0; i < 6; i++) {
        cells[i].textContent = save
            ? cells[i].firstElementChild.value.trim()
            : cells[i].dataset.original;
    }
 
    //vracam ikonice u poslednju celiju
    cells[6].innerHTML = cells[6].dataset.original;
    //skidam klasu editing
    row.classList.remove('editing');
 

    //cuvamo sacuvano u localstorage
    if (save) {
        saveTableToLocalStorage();
    }
}
 
 //ovde brisem greske i invalid classu
function clearErrors() {
    //praznim sve tekstove greske
    titleError.textContent = '';
    priorityError.textContent = '';
    statusError.textContent = '';
    createdByError.textContent = '';
    dateAssignedError.textContent = '';
    dueDateError.textContent = '';
 
//sklanjam klasu invalid
    titleInput.classList.remove('invalid');
    priorityInput.classList.remove('invalid');
    statusInput.classList.remove('invalid');
    createdByInput.classList.remove('invalid');
    dateAssignedInput.classList.remove('invalid');
    dueDateInput.classList.remove('invalid');
}
 //brisem polje
function clearFields() {
    //vracam sva polja u modalu na prazno
    titleInput.value = '';
    priorityInput.value = '';
    statusInput.value = '';
    createdByInput.value = '';
    dateAssignedInput.value = '';
    dueDateInput.value = '';
}
 //ovo je sa filter
function filterTasks() {
    //vatam iz local storage
    const data = JSON.parse(localStorage.getItem('savedTableData')) || [];
    //uzimam vrednosti koje su izabrane u filteru
    const statusFilter = statusInput.value;
    const dateAssignedFilter = filterDateAssignedInput.value;
    const dueDateFilter = filterDueDateInput.value;
 
//gledam dal metcjuje status sa filterom
    const filteredData = data.filter(item => {
        const matchesStatus =
            statusFilter === '' ||
            item.status.toLowerCase() === statusFilter.toLowerCase();
 //gledam dal metchuje date sa filterom
        const matchesDateAssigned =
            dateAssignedFilter === '' ||
            item.dateAssigned === dateAssignedFilter;
 //gledam dal metchuje drugi date sa filterom
        const matchesDueDate =
            dueDateFilter === '' ||
            item.dueDate === dueDateFilter;
 //ako sve tacno vracam ga i pokaze u tabelu
        return matchesStatus && matchesDateAssigned && matchesDueDate;
    });
 
 
    //praznim tabelu pre nego sto ubacim filtrirane redove
    tbody.innerHTML = '';
//filtriram i dodajem red
    filteredData.forEach(item => {
        addRow(item);
    });
    //posle filtriranja vracam se na prvu stranu
    currentPage = 1;
    //i prikazujem samo prvih 5 redova
    showPage();
}
 
 
 
 

//slusam klik na celu tabelu pa gledam sta je kliknuto
table.addEventListener('click', (e) => {
    //nalazim red u kom je kliknuto
    const row = e.target.closest('tr');
 //ovo je ako ono sto kliknem ima ovu sliku brise se red
    if (e.target.matches('img[src*="trash-can"]')) {
        //pamtim koji red se brise
        rowToDelete = row;
        //otvaram modal za potvrdu
        deleteModal.showModal();
    }
 //ovo ako kliknem zapocinje se starteditfunkcija
    if (e.target.matches('img[src*="pen-to-square"]')) {
        startEdit(row);
    }
 //isto ovde ako kliknem na savebtn poziva se finishedit funkcija
    if (e.target.matches('.save-btn')) {
        finishEdit(row, true);
    }
 //poziva se isto ta funkcija samo sto se prekida
    if (e.target.matches('.cancel-btn')) {
        finishEdit(row, false);
    }
});
 

//ovo je za dugme koje se pokaze kad izadje delete forma
confirmDeleteBtn.addEventListener('click', () => {
    //brisem samo ako postoji izabran red
    if (rowToDelete) {
        //skidam red iz tabele
        rowToDelete.remove();
        //cuvam posle brisanja u localstorage
        saveTableToLocalStorage();
        //ponovo racunam koji redovi se prikazuju posto se broj redova promenio
        showPage();
        //resetujem promenljivu
        rowToDelete = null;
    }
    //zatvaram modal
    deleteModal.close();
});
 
//za otkazivanje delete 
cancelDeleteBtn.addEventListener('click', () => {
    //zaboravljam red koji sam hteo da brisem
    rowToDelete = null;
    //zatvaram modal
    deleteModal.close();
});
 
 //za create new task button kad kliknem otvori modal
openTaskBtn.addEventListener('click', () => {
    modal.showModal();
    //odmah selekutje title input
    titleInput.focus();
});
 

//izlazi iz modala
cancelBtn.addEventListener('click', () => {
    modal.close();
});
 


//cim nesto ukucam, promenim ili zatvorim modal brisu se greske
modal.addEventListener('input', clearErrors);
modal.addEventListener('change', clearErrors);
modal.addEventListener('close', clearErrors);
 
//kad kliklnem dugme add task dodajem ove stvari
addToTableBtn.addEventListener('click', () => {
    //uzimam vrednosti iz svih polja, trim skida razmake sa pocetka i kraja
    let title = titleInput.value.trim();
    let priority = priorityInput.value;
    let status = statusCreateTaskInput.value;
    let createdBy = createdByInput.value.trim();
    let dateAssigned = dateAssignedInput.value;
    let dueDate = dueDateInput.value;
 //cistim greske
    clearErrors();
 //ako su neke od ovih stvari prazne ispod inputa ispisujem 
    if (title === '' || priority === '' || status === '' || createdBy === '' || dateAssigned === '' || dueDate === '') {
 //ovo
        titleError.textContent = title === '' ? 'please enter title' : '';
        priorityError.textContent = priority === '' ? 'please choose priority' : '';
        statusError.textContent = status === '' ? 'please choose status' : '';
        createdByError.textContent = createdBy === '' ? 'please enter creator' : '';
        dateAssignedError.textContent = dateAssigned === '' ? 'please enter date' : '';
        dueDateError.textContent = dueDate === '' ? 'please enter date' : '';
 
        //crvenim ivicu onim poljima koja su prazna
        titleInput.classList.toggle('invalid', title === '');
        priorityInput.classList.toggle('invalid', priority === '');
        statusCreateTaskInput.classList.toggle('invalid', status === '');
        createdByInput.classList.toggle('invalid', createdBy === '');
        dateAssignedInput.classList.toggle('invalid', dateAssigned === '');
        dueDateInput.classList.toggle('invalid', dueDate === '');
 
        //prekidam funkciju da se ne doda prazan task
        return;
    }
 
    //dodajem row i pravim objekat od njega da sacuvam u localstorage
    addRow({
        title,
        priority,
        status,
        createdBy,
        dateAssigned,
        dueDate
    });
    //cuvam 
    saveTableToLocalStorage();
    //osvezavam prikaz da se vidi samo trenutna strana
    showPage();
 
    //cistim polja i zatvaram modal
    clearFields();
    modal.close();
});

//funkcija koja prikazuje samo redove sa trenutne strane, ostale krije
function showPage() {
    //uzimam sve redove iz tabele
    const rows = tbody.querySelectorAll('tr');
    //racunam koliko ima strana (broj redova / 5 zaokruzeno na vise), minimum je 1
    const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

    //ako sam bio na strani koja vise ne postoji (npr. obrisao sam sve sa nje) vracam se na poslednju
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    //start je index prvog reda na ovoj strani (strana 2 -> index 5)
    const start = (currentPage - 1) * rowsPerPage;
    //end je index do kog se prikazuje (ne ukljucujuci njega)
    const end = start + rowsPerPage;

    //prolazim kroz sve redove, i je index reda
    rows.forEach((row, i) => {
        //ako je red unutar opsega ove strane prikazujem ga, inace ga sakrivam
        row.style.display = (i >= start && i < end) ? '' : 'none';
    });

    //from je redni broj prvog prikazanog reda, ako nema redova onda 0
    const from = rows.length === 0 ? 0 : start + 1;
    //to je redni broj poslednjeg prikazanog reda, ne sme da predje ukupan broj redova
    const to = Math.min(end, rows.length);
    //ispisujem tekst u footeru npr. 6-10 of 10
    pageInfo.textContent = `${from}-${to} of ${rows.length}`;
}

//klik na levu strelicu
prevPageBtn.addEventListener('click', () => {
    //idem nazad samo ako nisam vec na prvoj strani
    if (currentPage > 1) {
        //smanjujem broj strane
        currentPage--;
        //prikazujem tu stranu
        showPage();
    }
});

//klik na desnu strelicu
nextPageBtn.addEventListener('click', () => {
    //racunam ukupan broj strana
    const totalPages = Math.ceil(tbody.querySelectorAll('tr').length / rowsPerPage);
    //idem napred samo ako nisam vec na poslednjoj strani
    if (currentPage < totalPages) {
        //povecavam broj strane
        currentPage++;
        //prikazujem tu stranu
        showPage();
    }
});
 
 //uctivama iz locala
loadTableFromLocalStorage();
//posle ucitavanja odmah prikazujem prvu stranu
showPage();