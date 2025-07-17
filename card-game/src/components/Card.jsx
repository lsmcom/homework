import React from 'react';
import {styled} from 'styled-components';

const MyCard = styled.div`
    width: 120px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #eeeeee;
    border-radius: 7px;
    background-color: #efaaef;
`

const CardCheck = styled.input`
    margin-top: 5px;
`

function Card({children, checked, onChange, disabled}) {
    return (
        <>
            <MyCard>
                <CardCheck 
                    type='checkbox' 
                    name='cardNum'
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                {children}
            </MyCard>
        </>
    );
}

export default Card;