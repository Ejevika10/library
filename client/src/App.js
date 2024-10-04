import { useState, useEffect } from 'react';
import AddBookElem from './AddBookElem';
import BookList from './BookList';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [sort, setSort] = useState('');
  const [deleted, setDeleted] = useState(false);

  const callBackendAPI = async () => {
    const response = await fetch(`http://localhost:5000/api/books?sort=${sort}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  const handleSortChange = (newSort) => {
    console.log("sort " + newSort);

    setSort(newSort);
    setBooks([]);
  };
  
  const updateBook = (updatedBook) => {
    console.log("update");
    console.log(updatedBook);
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };
  const deleteBook = (id) => {
    setDeleted(true);
    setBooks([]);
  }
  const postBook = (postedBook) => {
    console.log("add");
    const new_books = [...books, postedBook]; 
    console.log(new_books);
    
    setBooks(
      new_books
    );
  };

  useEffect(() => {
    console.log("useEffect");
    console.log(sort);
    callBackendAPI()
    .then(res => {
      console.log(res);
      const new_books = res;
      setBooks(new_books);
    })
    .catch(err => console.log(err));
  }, [sort, deleted])
 
  return (
    <div>
      <AddBookElem postHandler = {postBook}/>
      <BookList books ={books} updateHandler ={updateBook} deleteHandler={deleteBook} sortHandler = {handleSortChange}/>
    </div>
  );
}
 
export default App;