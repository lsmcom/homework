import React, { useReducer, useState } from 'react';
import '../assets/css/Cards.css'
import Card from '../components/Card';

function CardBoard(props) {

    //전체 게임 상황을 관리할 객체 생성
    const initGame = {
        pcCards: [], //pc카드를 담을 빈 배열 생성
        displayCards: [], //화면에 보일 카드를 담을 빈 배열 생성
        selectedCards: [], //화면에서 선택한 카드를 담을 빈 배열 생성
        gameState: 'ready', //진행중인 게임 상태를 관리
        result: '' //게임 결과 관리
    };

    //1 ~ 20 사이의 랜덤 숫자 함수 만들기
    //count를 넘겨 받아 뽑을 갯수를 지정
    function getRandomNumbers(count) {
        //중복을 허용하지 않는 Set 컬렉션 생성
        const selected = new Set();

        //Set의 크기가 count 보다 작을 동안 계속 랜덤 숫자 선언
        while(selected.size < count){
            const num = Math.floor(Math.random() * 20) + 1; //1~20 사이의 랜덤 숫자
            selected.add(num); //중복이면 자동으로 무시된다.
        }

        //Set은 컬렉션 객체이므로 map, filter등의 배열 메서드를 지원하지 않으므로,
        //향후 map, filter를 사용하기 위해 Array로 변환
        return Array.from(selected);
    }

    //게임 진행 상황에 따른 실행 함수 선택하기
    const actionReducer = (state, action) => {
        //게임 진행 상황에 따라
        switch(action.type) {
            //'create' 일 경우 실행
            case 'create': {
                //pc 카드 2장 받기
                const $pcCards = getRandomNumbers(2);
                //화면에 보여줄 5개 카드 받기
                const $displayCards = getRandomNumbers(5);

                // 초기화 후 카드 정보와 게임 상태를 구조분해 할당으로 업데이트
                return {...initGame, pcCards: $pcCards, displayCards: $displayCards, gameState: 'playing'};
            }

            //'selectedCard'일 경우 실행
            case 'selectedCard': {
                //선택된 카드 번호 받아오기
                const cardNum = action.payload;

                //기존 선택된 카드 배열 복사(불변성 유지 목적)
                let newSelected = [...state.selectedCards];

                //이미 선택된 카드라면 선택 해제
                if(newSelected.includes(cardNum)) {
                    newSelected = newSelected.filter(n => n !== cardNum);
                }else {
                    //선택된 카드가 2개 미만이라면 카드 추가
                    if(newSelected.length < 2) {
                        newSelected.push(cardNum);
                    }else { 
                        //2개 이상이라면 추가 불가
                        alert('카드는 2장까지만 선택 가능합니다.')
                    }
                }

                // 선택된 카드 목록 업데이트
                return {...state, selectedCards: newSelected}
            }
            //'confirm'일 경우
            case 'confirm': {
                //선택된 카드가 2개가 아니라면
                if(state.selectedCards.length !== 2){
                    alert('카드 2장을 선택해주세요.');
                    return state; //상태 변경 없이 반환
                }

                //pc 카드 합 구하기
                const pcSum = state.pcCards.reduce((a, b) => a + b, 0);
                //사용자 카드 합 구하기
                const userSum = state.selectedCards.reduce((a, b) => a + b, 0);

                // 결과 문자열 저장할 변수
                let result = '';

                //사용자 승리 조건
                if(userSum > pcSum) {
                    result = `사용자 승리! (사용자 합: ${userSum} vs pc 합: ${pcSum})`;
                }else if(userSum < pcSum) { // PC 승리 조건
                    result = `pc 승리! (사용자 합: ${userSum} vs pc 합: ${pcSum})`;
                }else { // 무승부 조건
                    result = `무승부! (사용자 합: ${userSum} vs pc 합: ${pcSum})`;
                }
                
                // 결과 및 게임 상태 업데이트
                return {...state, result, gameState: 'end'};
            }

            //'reset'일 경우
            case 'reset':
                // 게임 상태 초기화
                return {...initGame};

            //위 case들 외의 액션이 들어온 경우 현재 상태 유지
            default:
            return state;
        }
    }

    const playGame = (actionType) => {
        dispatch({ type: actionType })
    };
    
    const selectCard = (cardNum) => {
        dispatch({ type: 'selectedCard', payload: cardNum })
    };

    const [gameList, dispatch] = useReducer(actionReducer, initGame);

    return (
        <div>
            <main className="container">
                <section className='contents'>
                    {
                        gameList.displayCards?.map((cardNum, index)=>(
                            <Card 
                                key={index}
                                checked={gameList.selectedCards.includes(cardNum)}
                                onChange={()=> selectCard(cardNum)}
                                disabled={gameList.gameState !== 'playing'}
                            >
                                <p style={{color : 'white'}}>
                                    {cardNum}
                                </p>
                            </Card>
                        ))
                    }
                </section>
                <section className='btn-box'>
                    <button
                        type="button"
                        className="btn"
                        onClick={()=> playGame('create')}
                        disabled={gameList.gameState === 'playing'}
                    >
                        시작
                    </button>

                    <button
                        type="button"
                        className="btn"
                        onClick={()=> playGame('confirm')}
                        disabled={gameList.gameState !== 'playing'}
                    >
                        선택 완료
                    </button>

                    <button
                        type="button"
                        className="btn"
                        onClick={()=> playGame('reset')}
                    >
                        리셋
                    </button>
                </section>
                <div>
                    <p>PC 카드: {gameList.gameState === 'playing' ? '' : gameList.pcCards.join(', ')}</p>
                    <p>결과: {gameList.result}</p>
                </div>
            </main>
        </div>
    );
}

export default CardBoard;