import React from "react";
import {useNavigate, Link} from "react-router-dom";
import { useState, useEffect } from 'react';

const BookElem = ({book, updateHandler, deleteHandler}) => {
    const [name, setName] = useState(book.name);
    const [author, setAuthor] = useState(book.author);
    const [status, setStatus] = useState(book.status);
    const [date, setDate] = useState(book.date);
    const [file, setFile] = useState(book.file);
    const [add_file, setAddFile] = useState(null);
    
    const [isEditing, setIsEditing] = useState(false);
    
    const handleDelete = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`http://localhost:5000/api/books/${book.id}`, {
            method: 'DELETE',
          });
          console.log(response);
          if (response.ok) {
            deleteHandler(book.id);
          } else {
            // Обработка ошибки
            console.error('Ошибка удаления книги');
          }
        } catch (error) {
          // Обработка ошибки
          console.error('Ошибка отправки формы', error);
        }

    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('author', author);
        formData.append('status', status);
        formData.append('date', date);
        if (add_file) {
          console.log(add_file);
          formData.append('file', add_file);
        }
        console.log(formData);
        try {
          const response = await fetch(`http://localhost:5000/api/books/${book.id}`, {
            method: 'PUT',
            body: formData,
          });
          if (response.ok) {
            const updatedBook = await response.json();
            console.log("updatedBook");
            console.log(updatedBook);
            setFile(updatedBook.file);
            updateHandler(updatedBook);
          } else {
            // Обработка ошибки
            console.error('Ошибка обновления книги');
          }
        } catch (error) {
          // Обработка ошибки
          console.error('Ошибка отправки формы', error);
        }
        setIsEditing(false);
    };
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDownload = async (filename) => {
      try {
        const response = await fetch(`http://localhost:5000/api/download/${filename}`);
        if (response.ok) {
          // Управление скачиванием -  например,  сохранение в браузере
          const blob = await response.blob(); 
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url); 
        } else {
          console.error('Ошибка загрузки файла');
        }
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
      }
    };

    return (
    <div>
        {!isEditing && 
        (<li class="book" id={"infoForm"+book.id}>
            <p class="text_wrapper">{name}</p>
            <p class="text_wrapper">{author}</p>
            <BookStatus status={status}/>    
            <div class="inp_form_wrapper">
                <p>Дата: </p>
                <p>{new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="inp_form_wrapper">
                {(file)  &&
                <div class="inp_form_wrapper">
                    <p>{file.toString().substring(14,file.toString().length)}</p>
                    <button class="download_btn" onClick={() => handleDownload(book.file)}>Скачать</button>
                </div>    
                } 
            </div>
            <div class="btn_wrapper">
                <form onSubmit={handleDelete}>
                    <button type='submit'>Удалить</button>
                </form>
                <button onClick={handleEditClick}>Редактировать</button>
            </div>
        </li>)}
        {isEditing && (
        <form class="add_wrapper" id={"editForm"+book.id} onSubmit={handleSubmit}>
            <h2>Редактировать книгу</h2>
            <div class="add_form_wrapper">
                <input type="text" id="name" name="name" placeholder="Название книги" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" id="author" name="author" placeholder="Автор" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <div>
                    <label htmlFor="status">Статус:</label>
                    <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} >
                        <option value="want to read">Хочу прочитать</option>
                        <option value="in process">Читаю</option>
                        <option value="completed">Прочёл</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Дата:</label>
                    <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <input type="file" id="file" name="file" onChange={(e) => setAddFile(e.target.files[0])} />
            </div>
            <button type="submit">Сохранить</button>
        </form>)}
    </div>
  );
} 
export default BookElem;

const BookStatus = ({ status }) => {
  switch (status) {
    case 'want to read':
      return <p className="text_wrapper">Хочу прочитать</p>;
    case 'in process':
      return <p className="text_wrapper">Читаю</p>;
    case 'completed':
      return <p className="text_wrapper">Прочёл</p>;
    default:
      return null; // Можно добавить сообщение об ошибке, если статус некорректный
  }
};
