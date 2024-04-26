let books = [];
const RENDER_EVENT = 'render-bookshelf';

function buatID() {
  return +new Date();
}

function buatBukuObjek(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function simpanDataKeStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function ambilDataDariStorage() {
  const storedData = localStorage.getItem('books');
  if (storedData) {
    books = JSON.parse(storedData);
    renderBuku();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const draggedElement = document.getElementById(data);
  const destinationList = event.target.closest('ul');

  if (destinationList) {
    destinationList.appendChild(draggedElement);

    const bookId = draggedElement.id.split('-')[1];
    const bookTarget = cariBukuIndeks(bookId);

    if (destinationList.id === 'shelf2-books') {
      books[bookTarget].isComplete = true;
    } else {
      books[bookTarget].isComplete = false;
    }

    simpanDataKeStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function buatBuku(bookObject) {
  const liElement = document.createElement('li');
  liElement.textContent = `${bookObject.title} - ${bookObject.author} (${bookObject.year})`;
  liElement.id = `book-${bookObject.id}`;
  liElement.draggable = true;
  liElement.addEventListener('dragstart', drag);

  const isCompleted = bookObject.isComplete;

  if (isCompleted) {
    const undoButton = buatButton('Ulang', 'undo-button', function () {
      ulangBukuKeComplete(bookObject.id);
    });

    const removeButton = buatButton('Hapus', 'remove-button', function () {
      lihatKonfirmasiDialog(bookObject.id);
    });

    liElement.appendChild(undoButton);
    liElement.appendChild(removeButton);
  } else {
    const completeButton = buatButton('Tandai Sudah Selesai', 'complete-button', function () {
      tambahBukuKeComplete(bookObject.id);
    });

    const editButton = buatButton('Edit', 'edit-button', function () {
      lihatEditDialog(bookObject.id, bookObject.title, bookObject.author, bookObject.year);
    });

    const removeButton = buatButton('Hapus', 'remove-button', function () {
      lihatKonfirmasiDialog(bookObject.id);
    });

    liElement.appendChild(completeButton);
    liElement.appendChild(editButton);
    liElement.appendChild(removeButton);
  }

  return liElement;
}

function buatButton(text, className, clickHandler) {
  const button = document.createElement('button');
  button.classList.add(className);
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function cariBukuIndeks(bookId) {
  for (let index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function tambahBukuKeComplete(bookId) {
  const bukuTargetIndeks = cariBukuIndeks(bookId);
  if (bukuTargetIndeks === -1) return;

  books[bukuTargetIndeks].isComplete = true;
  simpanDataKeStorage();
  renderBuku();
}

function hapusBukuDariComplete(bookId) {
  const bukuTargetIndeks = cariBukuIndeks(bookId);
  if (bukuTargetIndeks === -1) return;

  books.splice(bukuTargetIndeks, 1);
  simpanDataKeStorage();
  renderBuku();
}

function ulangBukuKeComplete(bookId) {
  const bukuTargetIndeks = cariBukuIndeks(bookId);
  if (bukuTargetIndeks === -1) return;

  books[bukuTargetIndeks].isComplete = false;
  simpanDataKeStorage();
  renderBuku();
}

function renderBuku() {
  const shelf1List = document.getElementById('shelf1-books');
  const shelf2List = document.getElementById('shelf2-books');

  shelf1List.innerHTML = '';
  shelf2List.innerHTML = '';

  for (const bookObject of books) {
    const bookElement = buatBuku(bookObject);
    if (bookObject.isComplete) {
      shelf2List.appendChild(bookElement);
    } else {
      shelf1List.appendChild(bookElement);
    }
  }
}

function lihatKonfirmasiDialog(bookId) {
  const confirmDialog = confirm(`Yakin mau hapus buku?`);

  if (confirmDialog) {
    hapusBukuDariComplete(bookId);
  }
}

function lihatEditDialog(bookId, currentTitle, currentAuthor, currentYear) {
  const newTitle = prompt('Edit Judul Buku:', currentTitle);
  const newAuthor = prompt('Edit Penulis:', currentAuthor);
  const newYear = prompt('Edit Tahun Terbit:', currentYear);

  if (newTitle !== null && newAuthor !== null && newYear !== null) {
    const bukuTargetIndeks = cariBukuIndeks(bookId);

    if (bukuTargetIndeks !== -1) {
      books[bukuTargetIndeks].title = newTitle;
      books[bukuTargetIndeks].author = newAuthor;
      books[bukuTargetIndeks].year = newYear;

      simpanDataKeStorage();
      renderBuku();
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  ambilDataDariStorage();
});



function tambahBuku() {
  const bookTitle = document.getElementById('book-title').value;
  const bookAuthor = document.getElementById('book-author').value;
  const bookYear = document.getElementById('book-year').value;
  const shelfId = document.getElementById('book-shelf').value;

  if (bookTitle.trim() === '' || bookAuthor.trim() === '' || bookYear.trim() === '') {
    alert('Masukkan keterangan buku secara detail');
    return;
  }

  const generatedID = buatID();
  const bookObject = buatBukuObjek(generatedID, bookTitle, bookAuthor, parseInt(bookYear), shelfId === 'shelf2');

  books.push(bookObject);
  simpanDataKeStorage();
  renderBuku();

  document.getElementById('book-title').value = '';
  document.getElementById('book-author').value = '';
  document.getElementById('book-year').value = '';
}



