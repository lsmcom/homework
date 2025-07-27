import React, { Fragment } from 'react';
import '../assets/css/showLotto.css';

function ShowLotto({ showSystemBall, showSystemBonus, showUserBall }) {
    return (
        <Fragment>
            <div className="lotto-box">
                <section className="system-box">
                    {showSystemBall}                    
                    {showSystemBonus}
                </section>
                <section className='user-box'>
                    {showUserBall}
                </section>
            </div>
        </Fragment>
    );
}

export default ShowLotto;