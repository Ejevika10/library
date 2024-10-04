import React from "react";
import {useNavigate, Link} from "react-router-dom";
import { useState, useEffect } from 'react';

const AddBookElem = ({postHandler}) => {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('want to read');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
   
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('author', author);
        formData.append('status', status);
        formData.append('date', date);
        if (file) {
          formData.append('file', file);
        }
        console.log(formData);
        try {
          const response = await fetch(`http://localhost:5000/api/books`, {
            method: 'POST',
            body: formData,
          });
          console.log(response);
          if (response.ok) {
            postHandler({'name': name, 'author': author, 'status': status, 'date': date,'file':file});
          } else {
            console.error('Ошибка добавления книги');
          }
        } catch (error) {
          // Обработка ошибки
          console.error('Ошибка отправки формы', error);
        }
    };

  return (
    <div class="add_wrapper">
        <h2>Добавить книгу</h2>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div class="add_form_wrapper">
                <input type="text" name="name" placeholder="Название книги" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" name="author" placeholder="Автор" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <div class="inp_form_wrapper">
                    <label htmlFor="status">Статус:</label>
                    <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} >
                        <option value="want to read">Хочу прочитать</option>
                        <option value="in process">Читаю</option>
                        <option value="completed">Прочёл</option>
                    </select>
                </div>
                <div class="inp_form_wrapper">
                    <b>Дата: </b>
                    <input type="date" name="date" min="2018-01-01" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <input type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} />                
            </div>
            <button type="submit" >Добавить</button>
        </form>  
    </div>
  );
} 
export default AddBookElem;