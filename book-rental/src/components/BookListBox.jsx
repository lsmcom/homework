import React from 'react';
import '../assets/css/bookList.css'

function BookListBox({ bookTitle, bookName, bookInputRef, addBook, rentalBook, deleteBook, showBookList }) {
    return (
        <div className='bookList-box'>
            <div className='bookList-text'>
                책 목록
            </div>
            <div className='input-btn-group'>
                <input type="text" 
                    className='book-input' 
                    placeholder='도서명을 입력하세요'
                    value={bookTitle}
                    onChange={bookName}
                    ref={bookInputRef}
                />
                <div className='book-btn-group'>
                    <button type='button' 
                        className='add-book'
                        onClick={addBook}
                    >추가</button>
                    <button type='button' 
                        className='rental-book'
                        onClick={rentalBook}
                    >대여</button>
                    <button type='button' 
                        className='delete-book'
                        onClick={deleteBook}
                    >삭제</button>
                </div>
            </div>
            <div className='book-group'>
                {showBookList}
            </div>
        </div>
    );
}

export default BookListBox;