import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import DraggableBoard from "./components/DraggableBoard";
import { BoardState, deleteSatate, toDoState, IToDoState } from "./atom";
import Delete from "./components/Delete";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const [isDark, setIsDark] = useState(true); //테마 설정
  const [isDelete, setIsDelete] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(BoardState);
  const setDeleted = useSetRecoilState(deleteSatate);

  const onBeforeDragStart = (info: DragStart) => {
    if (info.type === "DEFAULT") setDeleted(true);
  };
  const onDragEnd = (
    result: DropResult
  ) => {
    //////////////////
    //   draggableId:유저가 드래그 하고 있던 객체의 id
    //   source: draggable이 시작한 위치
    //   destination:draggable이 끝난 위치 (리스트 바깥에 drop되는 등 null이 될수도)
    const { destination, source } = result;

    // 유효한 드래그 드롭이 아닌 경우
    if (!destination) return;

    setDeleted(false);

    //보드 간 이동
    if (
      source.droppableId === "boards" &&
      destination.droppableId !== "delete"
    ) {
      setBoards((allBoards) => {
        const boardCopy = [...allBoards];
        const item = boardCopy.splice(source.index, 1)[0];
        boardCopy.splice(destination.index, 0, item);
        return boardCopy;
      });
    }
    //보드 삭제
    else if (destination.droppableId === "delete") {
      setBoards((allBoards) => {
        const boardCopy = [...allBoards];
        boardCopy.splice(source.index, 1);
        return boardCopy;
      });
    }
    //같은 보드 내에서 카드 움직임
    else if (source.droppableId === destination?.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const item = boardCopy.splice(source.index, 1)[0];
        boardCopy.splice(destination.index, 0, item);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    //다른 보드로 카드 움직임
    else if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const destinationCopy = [...allBoards[destination.droppableId]];
        const sourceCopy = [...allBoards[source.droppableId]];
        const item = sourceCopy.splice(source.index, 1)[0];
        destinationCopy.splice(destination.index, 0, item);
        return {
          ...allBoards,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        };
      });
    }
  };

  const addNewBoard = () => {
    // 최대 보드 수
    const maxBoards = 5;

    // 현재 보드 배열
    const currentBoards = boards;

    // 현재 보드 배열의 길이
    const currentBoardLength = currentBoards.length;

    // 새 보드 추가
    if (currentBoards.length < maxBoards) {
      const newBoard = `New Board(${currentBoardLength + 1})`;
      setBoards((prevBoards) => [...prevBoards, newBoard]); // 새 보드를 상태에 추가.
      setToDos((prevToDos) => ({
        ...prevToDos,
        [newBoard]: [],
      }));
    } else {
      // 최대 보드 수를 초과하는 경우에는 추가 작업을 수행하지 않음
      alert("최대 보드 갯수를 초과했습니다.");
    }
  };

  //테마 설정
  const setTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Wrapper>
        <Header>
          <span>To Do List</span>
          <div className="btn-area">
            <button className="btn" onClick={addNewBoard}>
              <HiPlus size="25" />
            </button>
            <button className="btn" onClick={setTheme}>
              {isDark ? (
                <MdOutlineLightMode size="25" />
              ) : (
                <MdOutlineDarkMode size="25" />
              )}
            </button>
          </div>
        </Header>
        <DragDropContext
          onDragEnd={onDragEnd}
          onBeforeDragStart={onBeforeDragStart}
        >
          <Droppable droppableId="boards" direction="horizontal">
            {(providedDroppable, snapshotProvided) => (
              <Boards
                ref={providedDroppable.innerRef}
                {...providedDroppable.droppableProps}
              >
                {boards.map((boardId, index) => (
                  <DraggableBoard
                    boardId={boardId}
                    toDos={toDos[boardId]}
                    index={index}
                    key={index}
                  />
                ))}
                {providedDroppable.placeholder}
              </Boards>
            )}
          </Droppable>
          <Delete />
        </DragDropContext>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;

const Wrapper = styled.div`
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 85%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  /* margin: 30px 10px; */
  padding: 30px 10px 0px 10px;
  span {
    font-size: 40px;
    font-weight: 600;
    color: ${(props) => props.theme.titleColor};
  }
  .btn-area {
    .btn {
      border-radius: 100%;
      border: ${(props) => props.theme.titleBtnBoder};
      width: 50px;
      height: 50px;
      margin-right: 10px;
      background-color: ${(props) => props.theme.bgColor};
      color: ${(props) => props.theme.titleColor};
      &:hover {
        box-shadow: ${(props) => props.theme.titleBtnShadow};
        cursor: pointer;
      }
    }
  }
`;

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
  width: 70%;
  margin: 0 auto;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:black;
  line-height: 1.2;
}
a {
  text-decoration:none;
  color:inherit;
}
`;
