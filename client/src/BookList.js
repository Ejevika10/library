import React from "react";
import {useNavigate, Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import BookElem from './BookElem';

const BookList = ({books, updateHandler, deleteHandler, sortHandler}) => {
    
    return(
    <div class="list_wrapper">
        <div class="head_wrapper">
            <h2>Мои книги</h2>
            <div>
                <div class="sort_btn_wrapper">
                    <button class="asc-icon-btn" onClick={() => sortHandler('statusAsc')}/>
                    <button class="desc-icon-btn" onClick={() => sortHandler('statusDesc')}/>
                </div>
                <div class="sort_btn_wrapper">
                    <button class="asc-icon-btn" onClick={() => sortHandler('dateAsc')}/>
                    <button class="desc-icon-btn" onClick={() => sortHandler('dateDesc')}/>
                </div>
            </div>
        </div>
        <ul>
        {books.map((book) => (
          <BookElem book = {book} updateHandler = {updateHandler} deleteHandler= {deleteHandler}/>
        ))}
      </ul>
    </div>
    );
}
export default BookList;