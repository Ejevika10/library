const fs = require('fs');

class Book{
    constructor(name, author, status = 'want to read', date = null, file = null) {
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        if (books.length > 0)
            this.id = books[books.length-1].id + 1;
        else 
            this.id = 0;
        this.name = name;
        this.author = author;
        this.status = status;
        this.date = date;
        this.file = file;
    }
    static getAll(){
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        return books;
    }
    static get(id){
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        return books.find(book => book.id == id);
    }
    static create(book){
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        const new_book = new Book(book.name, book.author, book.status, book.date, book.file);
        console.log(new_book)
        books.push(new_book);
        fs.writeFileSync('./model/books.json', JSON.stringify(books, null, 2), 'utf8');
        return new_book;
    }
    static update(id, book){
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        const upd_book = books.find(b => b.id === parseInt(id));
        if(upd_book) {
            upd_book.name = book.name;
            upd_book.author = book.author;
            upd_book.status = book.status;
            upd_book.date = book.date;
            if(book.file){
                upd_book.file = book.file;
            }
        }
        console.log(upd_book);
        fs.writeFileSync('./model/books.json', JSON.stringify(books, null, 2), 'utf8');
        console.log("hui");
  
        return upd_book;
    }
    static delete(id){
        const books = JSON.parse(fs.readFileSync('./model/books.json', 'utf8'));
        //console.log(books);
        const ind = books.findIndex(book => book.id == parseInt(id));
        //console.log(ind);
        if (ind !== -1) {
            books.splice(ind, 1);
        }
        fs.writeFileSync('./model/books.json', JSON.stringify(books, null, 2), 'utf8');
    }
}

module.exports = Book;