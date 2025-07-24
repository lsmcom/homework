import React, { useState } from 'react';
import '../assets/css/loginBox.css';

function LoginBox({ isUserSelected, selectBox, isLoginDisabled, isLogin }) {

    return (
        <div className='login-box'>
            <select className='user-select' onChange={isUserSelected}>
                <option value=''>사용자 선택</option>
                {selectBox}
            </select>
            <button 
                type='button' 
                className='login-btn' 
                disabled={isLoginDisabled}
                onClick={isLogin}
            >
                로그인
            </button>
        </div>
    );
}

export default LoginBox;