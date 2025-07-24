import React from 'react';
import '../assets/css/RentalListBox.css';

function RentalListBox({ userInfo, loginUserBooks, returnBooks }) {
    return (
        <div className='rental-box'>
            <div className="text-btn-group">
                <p className="rental-text">
                    {userInfo}님이 대여한 도서 목록
                </p>
                <button type='button' className='return-book' onClick={returnBooks}>
                    반납
                </button>
            </div>
            <div className='rental-listBox'>
                {loginUserBooks}
            </div>
        </div>
    );
}

export default RentalListBox;