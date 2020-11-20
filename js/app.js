// Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Handles UI
class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.getElementById('book-list');
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(tr); 
    }

    static clearFields(){
        const title = document.getElementById('title').value = " ";
        const author = document.getElementById('author').value = " ";
        const isbn = document.getElementById('isbn').value = " ";
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showMsg(message, alert){
        const div = document.createElement('div');
        div.className = `alert alert-${alert}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('.form');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        },3000);
    }
}

// Local Storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('Books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('Books'));
        }

        return books;
    }
    
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('Books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('Books', JSON.stringify(books));
    }
}

// Display Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Add Book
document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    if(title === "" || author === "" || isbn === ""){
        UI.showMsg('Please fill all fields', 'danger');
    }else{
        // Instantiate a book
        const book = new Book(title, author, isbn);
    
        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to Store
        Store.addBook(book);

        // Clear fields
        UI.clearFields();

        UI.showMsg("Book Added!", "success")
    }
});

// Remove Book
document.getElementById('book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showMsg("Book Deleted!", "success");
})