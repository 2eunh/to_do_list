import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./components/Board";
import React from "react";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;



function App() {
  const [toDos,setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if(!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index]; //to do object 받아오기
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if(destination.droppableId !== source.droppableId){
      // cross board movement
      setToDos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]]; //움직임이 시작된 board의 복사본
        const taskObj = sourceBoard[source.index]; //to do object 받아오기
        const destinationBoard = [...allBoard[destination.droppableId]]; // 움직임이 끝난 board의 복사본
        sourceBoard.splice(source.index, 1); //움직임이 시작될때 index를 지워주고
        destinationBoard.splice(destination?.index, 0, taskObj);  //움직임이 끝나는  board의 index에 넣어줌
        return{
          ...allBoard,
          [source.droppableId] : sourceBoard,
          [destination.droppableId] : destinationBoard
        }
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]}/>)}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;