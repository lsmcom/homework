import React, { Fragment, useMemo, useRef, useState } from 'react';
import '../assets/css/bookRental.css';
import LoginBox from '../components/LoginBox';
import RentalListBox from '../components/RentalListBox';
import BookListBox from '../components/BookListBox';

function BookRentalLayout(props) {

    //모든 도서 목록
    const [bookList, setBookList] = useState([]);

    //사용자 목록
    const [userList] = useState([
        {
            userId : 'user1', name : '홍길동'
        },
        {
            userId : 'user2', name : '김철수'
        },
        {
            userId : 'user3', name : '이유진'
        },
        {
            userId : 'user4', name : '손나연'
        }
    ]);

    //사용자별 대여 목록
    const [myBooks, setMyBooks] = useState([
        { userId : 'user1', books : [] },
        { userId : 'user2', books : [] },
        { userId : 'user3', books : [] },
        { userId : 'user4', books : [] },
    ]);
    
    //선택된 사용자 정보
    const [selectedUser, setSelectedUser] = useState('');
    //로그인된 사용자 정보
    const [loginUser, setLoginUser] = useState('');
    //입력된 도서 이름 정보
    const [bookTitle, setBookTitle] = useState('');
    //선택된 대여 도서 목록 정보
    const [checkedRentalBooks, setCheckedRentalBooks] = useState([]);
    //도서 입력 상태 정보
    const bookInputRef = useRef(null);

    //로그인한 사용자의 도서 목록 가져오기
    const loginUserBooks = useMemo(() => {
        return myBooks.find(user => user.userId === loginUser)?.books || []
    }, [myBooks, loginUser]);

    //선택된 사용자 정보 가져오기
    const checkSelected = (e) => {
        setSelectedUser(e.target.value);
    };

    //로그인 클릭 시 선택된 사용자 정보 넘겨주기
    const isLogin = () => {
        setLoginUser(selectedUser);
    };

    //로그인한 사용자 이름 찾기
    const userInfo = userList.find(user => user.userId === loginUser)?.name || '';

    //입력된 도서 이름 가져오기
    const getBookName = (e) => {
        setBookTitle(e.target.value);
    };

    //입력된 도서를 도서 목록에 추가
    const addBook = () => {

        // 공백 입력 방지
        if (!bookTitle.trim()){
            alert('추가할 도서를 입력하세요');
            bookInputRef.current.focus();
            return false;
        };

        //추가할 도서
        const newBook = {
            id : Date.now(),
            title : bookTitle,
            isChecked : false,
            isRented : false,
            rentedBy : null 
        };

        //도서 목록에 추가할 도서 넣기
        setBookList((prev) => [...prev, newBook]);
        //입력창 비우기
        setBookTitle('');
    };

    //도서 목록 체크박스 업데이트
    const updateChecked = (bookId) => {
        setBookList(prev => prev.map(book => 
            book.id === bookId ? {...book, isChecked : !book.isChecked} : book
        ));
    };

    //도서 삭제하기
    const deleteBook = () => {

        //선택된 도서 목록 가져오기
        const selectedBooks = bookList.filter(book => book.isChecked && !book.isRented);

        //선택된 도서가 없을 경우
        if(selectedBooks.length === 0){
            alert('삭제할 도서를 선택해주세요.');
            return;
        };

        //대여 중인 도서는 삭제 불가
        if (selectedBooks.some(book => book.isRented)) {
            alert('대여 중인 도서는 삭제할 수 없습니다.');
            return;
        }

        //삭제 처리
        setBookList(prev =>
            prev.filter(book => !selectedBooks.some(del => del.id === book.id))
        );
    };

    //도서 대여 상태 업데이트
    const updateBookRentalStatus = (targetIds, isRented, uncheck = false) => {
        return setBookList(prev => 
            prev.map(book =>
            targetIds.includes(book.id)
                ? { 
                    ...book, 
                    isRented, 
                    rentedBy: isRented ? loginUser : null,
                    ...(uncheck ? { isChecked: false } : {}) //반납이면 체크 해제
                }
                : book
            )
        );
    };

    //도서 대여하기
    const rentalBook = () => {

        //선택된 도서 목록 가져오기
        const selectedBooks = bookList.filter(book => book.isChecked && !book.isRented);

        //선택된 도서가 없을 경우
        if(selectedBooks.length === 0){
            alert('대여할 도서를 선택해주세요.');
            return;
        };

        //로그인된 사용자가 없을 경우
        if(loginUser === ''){
            alert('로그인을 해야 도서 대여가 가능합니다..');
            return;
        };

       updateBookRentalStatus(selectedBooks.map(b => b.id), true);

       //사용자별 대여 목록에도 추가
       setMyBooks(prev => prev.map(user => 
            user.userId === loginUser ? {
                ...user, books : [...user.books, ...selectedBooks.map(book => ({
                    id : book.id,
                    title : book.title
                }))]
            } : user
       ));

    };

    //반납 체크박스 변경
    const updateRentalChecked = (id) => {
        setCheckedRentalBooks(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    //도서 반납하기
    const returnBooks = () => {

        //선택된 대여 도서가 없을 경우
        if(checkedRentalBooks.length === 0) {
            alert('반납할 도서를 선택해주세요');
            return;
        };

        updateBookRentalStatus(checkedRentalBooks, false, true);

        //로그인된 사용자의 대여 목록에서 반납한 도서 제거
        setMyBooks(prev => prev.map(user =>
            user.userId === loginUser 
            ? {
                ...user,
                books : user.books.filter(book => !checkedRentalBooks.includes(book.id))
              }
            : user
        ));

        //체크상태 초기화
        setCheckedRentalBooks([]);
    }

    //사용자를 선택할 수 있는 선택박스 만들기
    const userSelectBox = userList?.map((user) => (
        <option key={user.userId} value={user.userId}>
            {user.name}
        </option>
    ))

    //도서 목록 보여주기
    const showBookList = bookList?.map((book) => (
        <div className="book-box" key={book.id}>
            <input 
                type="checkbox" 
                name='book' 
                id={book.id} 
                checked={book.isChecked}
                disabled={book.isRented}
                onChange={() => !book.isRented && updateChecked(book.id)}
            />
            <label htmlFor={book.id} >{book.title}</label>
        </div>
    ));

    //로그인한 사용자의 대여 목록 리스트 만들기
    const userRentalBooks = loginUserBooks?.map((book) => (
        <Fragment>
            <input 
                type='checkbox' 
                name='rentalBook' 
                id={book.id}
                checked={checkedRentalBooks.includes(book.id)}
                onChange={() => updateRentalChecked(book.id)}
            />
            <label htmlFor={book.id}>{book.title}</label>
        </Fragment>
    ));

    return (
        <Fragment>
            <main className='main'>
                <div className="container">
                    <section className='login-contents'>
                        <LoginBox 
                            selectBox={userSelectBox}
                            isUserSelected={checkSelected}
                            isLoginDisabled={selectedUser === ""}
                            isLogin={isLogin}
                        />
                    </section>
                    <section className='rental-contents'>
                        <RentalListBox
                            userInfo={userInfo}
                            loginUserBooks={userRentalBooks}
                            returnBooks={returnBooks}
                        />
                    </section>
                    <section className='bookList-contents'>
                        <BookListBox 
                            bookTitle={bookTitle}
                            bookName={getBookName}
                            bookInputRef={bookInputRef}
                            addBook={addBook}
                            showBookList={showBookList}
                            rentalBook={rentalBook}
                            deleteBook={deleteBook}
                        />
                    </section>
                </div>
            </main>
        </Fragment>
    );
}

export default BookRentalLayout;