import React, { useRef, useState } from 'react';
import '../assets/css/todoList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoListLayout(props) {

    const [todo, setTodo] = useState('');
    const [todoList, setTodoList] = useState([])
    const todoInputRef = useRef(null);
    const [selectedTodos, setSelectedTodos] = useState([]);

    //todo추가 함수
    const createTodo = () => {

        //입력된 todo가 없을 경우
        if(todo.trim().length === ''){
            alert('할일을 입력하십시오.');
            todoInputRef.current.focus();
            return;
        }

        //새로운 todo객체 만들기
        const newTodo = {
            id : Date.now(),
            value : todo,
            done : false
        }

        //todo리스트에 입력된 todo 추가하기
        setTodoList((prev) => [...prev, newTodo]);
        //입력된 todo 초기화
        setTodo('');
    };

    //엔터로도 todo추가 함수
    const EnterInput = (e) => {

        //입력된 키가 엔터일 경우
        if (e.key === 'Enter') {
            createTodo(); //todo 추가 함수 실행
        }
    }

    //todo 체크박스 변경 함수
    const handleCheckboxChange = (id) => {

        //선택된 todo 중에 가져온 id가 포함되는지 확인
        setSelectedTodos((prev) =>prev.includes(id) 
            ? prev.filter((itemId) => itemId !== id) // true 일 경우 체크 해제
            : [...prev, id] // false 일 경우 체크
        );
    };

    //todo 일괄 완료 함수
    const allCheckTodo = () => {

        //선택된 todo가 없을 경우
        if (selectedTodos.length === 0) {
            alert('일괄 완료할 할 일을 먼저 선택하세요.');
            return;
        }

        //todo 목록만큼 반복을 돌려
        setTodoList(prev => prev.map(item =>
            
            //선택된 todo가 todo 목록의 id가 포함되는지 확인
            selectedTodos.includes(item.id)
                ? { ...item, done: true } //true일 경우 해당 todo의 완료 상태를 true로 변환
                : item //false일 경우 해당 todo 그대로 반환
            )
        );

        setSelectedTodos([]); // 선택 초기화
    };

    //todo 완료 함수
    const checkTodo = (id) => {

        //todo 목록만큼 반복을 돌려
        setTodoList(prev => prev.map(item =>

            //todo의 id가 가져온 id와 같은지 확인
            item.id === id
                ? { ...item, done: true } //true일 경우 해당 todo의 완료 상태를 true로 변환
                : item //false일 경우 해당 todo 그대로 반환
            )
        );

        setSelectedTodos(prev => [...new Set([...prev, id])]); // 선택 상태에도 추가
    };

    //todo 삭제 함수
    const deleteTodo = (id) => {

        const confirm = window.confirm('정말 삭제하시겠습니까?');
        
        if(confirm){
            setTodoList(prev => prev.filter(item => item.id !== id))
        }
    }

    //완료된 건수 계산
    const doneCount = todoList.filter(item => item.done).length;
    //todo 건수 계산
    const todoCount = todoList.length - doneCount;
    //완료율 계산
    const donePercent = todoList.length === 0 ? 0 : ((doneCount / todoList.length) * 100).toFixed(2);

    return (
        <div className='body'>
            <main className="container">
                <section className="contents">
                    <header className="header mb-3">
                        <p>TodoList</p>
                    </header>
                    <section className="work-status mb-3">
                        <p>할 일 : <span>{todoCount}</span>건</p>
                        <p>한 일 : <span>{doneCount}</span>건</p>
                        <p>달성률 : <span>{donePercent}</span>%</p>
                    </section>
                    <section className="todo-input mb-4">
                        <div className="row">
                            <div className="col-8">
                                <input type="text" 
                                    className="form-control" 
                                    id="inputTodo" 
                                    ref={todoInputRef}
                                    value={todo}
                                    onKeyDown={EnterInput}
                                    onChange={(e) => setTodo(e.target.value)}
                                    placeholder='할 일을 입력하십시오.'
                                />
                            </div>
                            <div className="col-4 text-end">
                                <button type="button" className="btn btn-primary me-2" onClick={createTodo}>등록</button>
                                <button type="button" className="btn btn-success" onClick={allCheckTodo}>일괄 완료</button>
                            </div>
                        </div>
                    </section>
                    <section className="todo-list">
                        {
                            todoList?.map(item => (
                                <div key={item.id} className={`todo mb-2 ${item.done ? 'complete' : ''}`}>
                                    <div className="item1">
                                        <input type="checkbox" 
                                            checked={selectedTodos.includes(item.id) || item.done}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={item.done} // 완료된 건 선택 불가
                                            title={item.done ? "완료된 항목입니다" : ""}
                                        />
                                    </div>
                                    <div className="item2">
                                        <p style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                                            {item.value}
                                        </p>
                                    </div>
                                    <div className="item3 text-end">
                                        <button
                                            type="button"
                                            className="btn btn-success me-1"
                                            onClick={() => checkTodo(item.id)}
                                            disabled={item.done}
                                        >
                                            완료
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => deleteTodo(item.id)}
                                            >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                </section>
            </main>
        </div>
    );
}

export default TodoListLayout;