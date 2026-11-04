//domom selektujem html i stavljam u neke promenljive da ne moram uvek da kucam document.queryselector
let modal = document.querySelector('#modal');
let openTaskBtn = document.querySelector('.new-task-button');
let addToTableBtn = document.querySelector('#addToTable');
let cancelBtn = document.querySelector('#cancel');
let table = document.querySelector('table');
let tbody = document.querySelector('table tbody');

//polja u modalu za pravljenje taska
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

//polja za filter iznad tabele
let filterStatusInput = document.querySelector('#filterStatus');
let filterDateAssignedInput = document.querySelector('#filterDateAssigned');
let filterDueDateInput = document.querySelector('#filterDueDate');

let deleteModal = document.querySelector('#deleteModal');
let confirmDeleteBtn = document.querySelector('#confirmDelete');
let cancelDeleteBtn = document.querySelector('#cancelDelete');
//ovde pamtim koji red treba da se obrise, na pocetku nijedan
let rowToDelete = null;

let currentPage = 1;
let rowsPerPage = 4;
let prevPageBtn = document.querySelector('#prevPage');
let nextPageBtn = document.querySelector('#nextPage');
let pageInfo = document.querySelector('#pageInfo');
let rowsSelect = document.querySelector('#rowsSelect');

let searchContainer = document.getElementById('search-container');
let searchInput = document.getElementById('search-input');
let searchBtn = document.getElementById('search-btn');
let searchForm = document.getElementById('search-form');

//ovde pamtim sta je izabrano u filteru (primenjuje se tek kad kliknem Filter)
let appliedFilters = {
    status: '',
    dateAssigned: '',
    dueDate: ''
};


//cuvam podatke u local storage
function saveTableToLocalStorage() {
    //u pormenljivu rows stavljam sve tr sem theadera
    const rows = tbody.querySelectorAll('tr');
    //pravim prazan array gde cu da cuvam podatke
    const tableData = [];

    //pravim loop koj prolazi kroz svaki red
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

        let field;
        if (i === 1) {
            //pravim select i kopiram opcije iz modala za priority
            field = document.createElement('select');
            field.innerHTML = priorityInput.innerHTML;
        } else if (i === 2) {
            //isto za status
            field = document.createElement('select');
            field.innerHTML = statusInput.innerHTML;
        } else {
            //za ostalo pravim input, za datume date a za ostalo text
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
        //ako je polje prazno ne dajem da se sacuva
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

    //posle editovanja ponovo proveravam da li red jos odgovara filteru/searchu
    showPage();
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


//proveravam da li jedan red odgovara filteru I searchu
function rowMatches(row) {
    //ako se red trenutno edituje, uvek ga prikazujem da ne nestane dok kucam
    if (row.classList.contains('editing')) {
        return true;
    }

    //uzimam tekst iz svake celije i pretvaram u mala slova
    const cells = row.querySelectorAll('td');
    const title = cells[0].textContent.toLowerCase();
    const priority = cells[1].textContent.toLowerCase();
    const status = cells[2].textContent.toLowerCase();
    const createdBy = cells[3].textContent.toLowerCase();
    const dateAssigned = cells[4].textContent;
    const dueDate = cells[5].textContent;

    //1) FILTER (status i datumi) - prazno znaci da se ne filtrira
    const matchesStatus =
        appliedFilters.status === '' ||
        status === appliedFilters.status.toLowerCase();

    const matchesDateAssigned =
        appliedFilters.dateAssigned === '' ||
        dateAssigned === appliedFilters.dateAssigned;

    const matchesDueDate =
        appliedFilters.dueDate === '' ||
        dueDate === appliedFilters.dueDate;

    //2) SEARCH - ono sto kucam u search baru
    const query = searchInput.value.trim().toLowerCase();

    let matchesSearch = true;
    if (query !== '') {
        //"active" je deo reci "inactive", pa ako kucam tacno active/inactive poredim celu rec
        const statusMatch = (query === 'active' || query === 'inactive')
            ? status === query
            : status.includes(query);

        //trazim u svim kolonama: title, priority, status, created by i datumi
        matchesSearch =
            title.includes(query) ||
            priority.includes(query) ||
            statusMatch ||
            createdBy.includes(query) ||
            dateAssigned.includes(query) ||
            dueDate.includes(query);
    }

    //red se prikazuje samo ako odgovara svemu
    return matchesStatus && matchesDateAssigned && matchesDueDate && matchesSearch;
}

//vraca niz redova koji odgovaraju filteru i searchu
function getMatchingRows() {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    return rows.filter(rowMatches);
}

//ovo je za dugme Filter, samo pamti sta je izabrano i osvezava prikaz
function filterTasks() {
    appliedFilters.status = filterStatusInput.value;
    appliedFilters.dateAssigned = filterDateAssignedInput.value;
    appliedFilters.dueDate = filterDueDateInput.value;

    //posle filtriranja vracam se na prvu stranu
    currentPage = 1;
    showPage();
}


//slusam klik na celu tabelu pa gledam sta je kliknuto
table.addEventListener('click', (e) => {
    //nalazim red u kom je kliknuto
    const row = e.target.closest('tr');
    //ako je kliknuto van reda (npr. na razmak) ne radim nista
    if (!row) return;

    //ovo je ako ono sto kliknem ima ovu sliku brise se red
    if (e.target.matches('img[src*="trash-can"]')) {
        //pamtim koji red se brise
        rowToDelete = row;
        //otvaram modal za potvrdu
        deleteModal.showModal();
    }
    //ovo ako kliknem zapocinje se startedit funkcija
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
addToTableBtn.addEventListener('click', (e) => {
    //sprecavam da se forma posalje i da se stranica osvezi
    e.preventDefault();

    //uzimam vrednosti iz svih polja, trim skida razmake
    let title = titleInput.value.trim();
    let priority = priorityInput.value;
    let status = statusInput.value;
    let createdBy = createdByInput.value.trim();
    let dateAssigned = dateAssignedInput.value;
    let dueDate = dueDateInput.value;
    //cistim greske
    clearErrors();
    //ako su neke od ovih stvari prazne ispod inputa ispisujem
    if (title === '' || priority === '' || status === '' || createdBy === '' || dateAssigned === '' || dueDate === '') {

        titleError.textContent = title === '' ? 'please enter title' : '';
        priorityError.textContent = priority === '' ? 'please choose priority' : '';
        statusError.textContent = status === '' ? 'please choose status' : '';
        createdByError.textContent = createdBy === '' ? 'please enter creator' : '';
        dateAssignedError.textContent = dateAssigned === '' ? 'please enter date' : '';
        dueDateError.textContent = dueDate === '' ? 'please enter date' : '';

        //crvenim ivicu onim poljima koja su prazna
        titleInput.classList.toggle('invalid', title === '');
        priorityInput.classList.toggle('invalid', priority === '');
        statusInput.classList.toggle('invalid', status === '');
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
    //svi redovi u tabeli
    const allRows = Array.from(tbody.querySelectorAll('tr'));
    //samo oni koji odgovaraju filteru i searchu
    const matchingRows = allRows.filter(rowMatches);

    //racunam koliko ima strana (broj redova / rowsPerPage zaokruzeno na vise), minimum je 1
    const totalPages = Math.max(1, Math.ceil(matchingRows.length / rowsPerPage));

    //ako sam bio na strani koja vise ne postoji (npr. obrisao sam sve sa nje) vracam se na poslednju
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    //start je index prvog reda na ovoj strani npr. strana 2 sa 5 redova -> index 5
    const start = (currentPage - 1) * rowsPerPage;
    //end je index do kog se prikazuje (ne ukljucujuci njega)
    const end = start + rowsPerPage;

    //prvo sakrivam sve redove
    allRows.forEach(row => {
        row.style.display = 'none';
    });

    //pa prikazujem samo one koji odgovaraju searchu/filteru I su na trenutnoj strani
    matchingRows.forEach((row, i) => {
        if (i >= start && i < end) {
            row.style.display = '';
        }
    });

    //from je redni broj prvog prikazanog reda, ako nema redova onda 0
    const from = matchingRows.length === 0 ? 0 : start + 1;
    //to je redni broj poslednjeg prikazanog reda, ne sme da predje ukupan broj redova
    const to = Math.min(end, matchingRows.length);
    //ispisujem tekst u footeru npr. 6-10 of 10
    pageInfo.textContent = `${from}-${to} of ${matchingRows.length}`;
}

//klik na levu strelicu
prevPageBtn.addEventListener('click', () => {
    //idem nazad samo ako nisam vec na prvoj strani
    if (currentPage > 1) {
        currentPage--;
        showPage();
    }
});

//klik na desnu strelicu
nextPageBtn.addEventListener('click', () => {
    //racunam ukupan broj strana samo od redova koji odgovaraju searchu/filteru
    const totalPages = Math.ceil(getMatchingRows().length / rowsPerPage);
    //idem napred samo ako nisam vec na poslednjoj stranis
    if (currentPage < totalPages) {
        currentPage++;
        showPage();
    }
});

//kad promenim broj redova po strani u dropdownu
rowsSelect.addEventListener('change', () => {
    //uzimam izabranu vrednost iz selecta, Number je pretvara iz stringa u broj
    rowsPerPage = Number(rowsSelect.value);
    //vracam se na prvu stranu da ne ostanem na strani koja mozda vise ne postoji
    currentPage = 1;
    showPage();
});


//SEARCH BAR

//klik na lupu otvara/zatvara search input
searchBtn.addEventListener('click', () => {
    searchContainer.classList.toggle('active');

    if (searchContainer.classList.contains('active')) {
        //ako se otvorio, odmah fokusiram input da mogu da kucam
        searchInput.focus();
    } else {
        //ako se zatvorio, brisem tekst i vracam sve redove
        searchInput.value = '';
        currentPage = 1;
        showPage();
    }
});

//dok kucam u search filtriram tabelu uzivo
searchInput.addEventListener('input', () => {
    //vracam se na prvu stranu jer se rezultati menjaju
    currentPage = 1;
    showPage();
});

//ako pritisnem enter u searchu ne dam da se stranica osvezi
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
});


//uctivama iz locala
loadTableFromLocalStorage();
//posle ucitavanja odmah prikazujem prvu stranu
showPage();