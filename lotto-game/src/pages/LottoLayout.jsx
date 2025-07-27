import React, { Fragment, useState } from 'react';
import '../assets/css/lottoLayout.css'
import LottoButton from '../components/LottoButton';
import ShowLotto from '../components/ShowLotto';

function LottoLayout(props) {

    //시스템 로또 저장할 객체
    const [systemLotto, setSystemLotto] = useState({ numbers : [], bonus : null })

    //유저 로또 저장할 배열
    const [userLotto, setUserLotto] = useState([])

    //결과를 담을 배열
    const [results, setResults] = useState([]);

    //비교 클릭 여부 확인
    const [isCompared, setIsCompared] = useState(false);

    //시스템 번호 생성 함수
    const createSystemNum = () => {

        //시스템 로또 초기화
        setSystemLotto({ numbers : [], bonus : null });

        //6개의 번호를 담을 배열
        const lotto = [];
        //보너스 번호
        let bonusNum = 0;
        //현재 몇개의 번호를 뽑았는지 카운트
        let count = 0;

        //반복하며 번호 생성 후 넣기
        while(count < 7) { //
            const num = Math.floor(Math.random() * 45) + 1;

            //중복 확인
            if(lotto.includes(num)) continue;

            //보너스 번호 넣기
            if(count === 6) {
                bonusNum = num;
                break;
            }

            //로또 배열에 값 넣기
            lotto.push(num);
            //카운트 증가
            count++;
        }

        //오름차순 정렬
        lotto.sort((a, b) => a - b);

        const mainNumbers = [...lotto];
        setSystemLotto({ numbers: mainNumbers, bonus: bonusNum });

        isSystemShow();
    }

    //로또 생성 버튼 클릭시 시스템 번호 보여주기
    const isSystemShow = () => {
        return true;
    }
    
    //시스템 볼에 번호 넣기
    const showSystemBall = () => {
        
        return (
            <div className="system-layout">
                {systemLotto.numbers.map((num, index) => (
                    <div className="system-ball" key={index}>{num}</div>
                ))}
            </div>
        );
    }

    //시스템 보너스 번호 넣기
    const showSystemBonus = () => {

        //보너스번호가 null일 경우 리턴X
        if(systemLotto.bonus === null) return null;

        return (
            <>
                <p className='system-text'>+</p>
                <div className="system-bonus-layout">
                    <div className="system-ball">{systemLotto.bonus}</div>
                </div>
            </>
        );
    };

    //유저 로또 번호 5줄 생성
    const createUserNum = () => {

        //유저 로또 초기화
        setUserLotto([]);

        //1~45 전체 숫자 배열 만들기
        const numbers = Array.from({ length: 45 }, (_, i) => i + 1);

        //배열을 무작위로 섞기
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        //앞에서 30개만 잘라서 사용
        const selected = numbers.slice(0, 30);

        //6개씩 끊어서 2차 배열 만들기
        const result = [];
        for (let i = 0; i < 5; i++) {
            const group = selected.slice(i * 6, i * 6 + 6).sort((a, b) => a - b); // 오름차순 정렬
            result.push(group);
        }

        setUserLotto(result);
    }

    //유저 볼에 번호 넣기
    const showUserBall = userLotto.map((row, idx) => (
        <div className="user-numBox" key={idx}>
            {row.map((num, index) => {
                const isMatched = systemLotto.numbers.includes(num);
                const isBonus = num === systemLotto.bonus;

                const style = (isCompared && (isMatched || isBonus)) ? { backgroundColor: randColor() } : {};

                return (
                    <div className="user-ball" key={index} style={style}>
                        {num}
                    </div>
                );
            })}
            {results[idx] && <p className="rank-text">{results[idx].rank}</p>}
        </div>
    ));

    //랜덤으로 색표현
    function randColor(){
        const colors = [];
        let count = 0;

        while(count < 3){
            const randColor = Math.floor(Math.random() * 256);
            //10진수 -> 16진수
            let hexColor = randColor.toString(16);
            //비교 == 는 값만 비교 === 값과 타입 둘다 비교
            if(hexColor.length === 1){
                hexColor = '0' + hexColor;
            }
            colors.push(hexColor);
            count++;
        }

        return '#' + colors.join('');
    }

    //비교하기
    const startCompare = () => {

        //시스템 로또나 유저 로또가 없을 경우
        if (systemLotto.numbers.length === 0 || userLotto.length === 0) {
            alert("먼저 로또 번호를 생성하세요!");
            return;
        }

        setIsCompared(true);

        const systemNums = systemLotto.numbers;
        const bonus = systemLotto.bonus;

        //각 줄별 로또 결과 비교하기
        const newResults = userLotto.map(row => {
            let matchCount = 0;
            let hasBonus = false;

            //줄별 맞춘 횟수 찾기
            row.forEach(num => {
                if (systemNums.includes(num)) matchCount++;
                if (num === bonus) hasBonus = true;
            });

            // 등수 계산
            let rank = "";
            if (matchCount === 6) {
                rank = "1등";
            } else if (matchCount === 5 && hasBonus) {
                rank = "2등";
            } else if (matchCount === 5) {
                rank = "3등";
            } else if (matchCount === 4) {
                rank = "4등";
            } else if (matchCount === 3) {
                rank = "5등";
            } else {
                rank = "낙첨";
            }

            return { matchCount, hasBonus, rank };
        });

        setResults(newResults);
    };

    return (
        <Fragment>
            <main className="main">
                <header className="header">
                    <h1>로또 게임</h1>
                </header>
                <div className="container">
                    <LottoButton 
                        createSystemNum={createSystemNum}
                        createUserNum={createUserNum}
                        startCompare={startCompare}
                    />
                    <ShowLotto 
                        showSystemBall={isSystemShow() ? showSystemBall() : null}
                        showSystemBonus={isSystemShow() ? showSystemBonus() : null}
                        showUserBall={showUserBall}
                    />
                </div>
            </main>
        </Fragment>
    );
}

export default LottoLayout;