const express = require('express');
const multer  = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

const cors = require('cors'); 
const app = express();     
app.use(cors()); 
const port = 5000;

const Book = require('./model/bookModel'); 

app.get('/api/books', (req, res) => {
  console.log("get");
  const { sort } = req.query;
  console.log(sort);
  
  let books = Book.getAll(); // Получаем все задачи из модели
  if (sort === 'dateAsc') {
    books.sort((a, b) => new Date(a.date) - new Date(b.date)); // По возрастанию даты
  } else if (sort === 'dateDesc') {
    books.sort((a, b) => new Date(b.date) - new Date(a.date)); // По убыванию даты
  } else if (sort === 'statusAsc') {
      books.sort((a, b) => a.status.localeCompare(b.status)); // По возрастанию статуса (алфавитно)
  } else if (sort === 'statusDesc') {
      books.sort((a, b) => b.status.localeCompare(a.status)); // По убыванию статуса (алфавитно)
  }
  console.log(books);
  res.json(books);
});

app.delete('/api/books/:id', (request, response) => {
    console.log("delete");
    const { id } = request.params;
    console.log(id);
    Book.delete(id);
    response.json();
});

app.post('/api/books', upload.single('file'), (request, response) => {
  console.log("hui");
  const { name, author, status, date} = request.body;
  const file = request.file ? request.file.filename : null;
  Book.create({name, author, status, date, file});
  console.log("hui");
  response.json();
});

app.put('/api/books/:id', upload.single('file'),(request, response) => {
  const { id } = request.params;
  //console.log(id);
  const { name, author, status, date} = request.body;
  //console.log(name, author, status, date);
  const file = request.file ? request.file.filename : null;
  const res = Book.update(id,{ name, author, status, date, file });
  response.json(res);
});
  
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = __dirname + '\\uploads\\' + filename;
  console.log(filename);
  console.log(filePath);
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});