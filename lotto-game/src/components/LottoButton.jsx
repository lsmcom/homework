import React, { Fragment } from 'react';
import '../assets/css/lottoButton.css';

function LottoButton({ createSystemNum, createUserNum, startCompare }) {
    return (
        <Fragment>
            <div className="btn-group">
                <button type='button' className='create-lotto' onClick={createSystemNum}>
                    로또생성
                </button>
                <button type='button' className='user-lotto' onClick={createUserNum}>
                    유저로또
                </button>
                <button type='button' className='compare-lotto' onClick={startCompare}>
                    비교
                </button>
            </div>
        </Fragment>
    );
}

export default LottoButton;