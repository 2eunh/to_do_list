import styled from "styled-components";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDarkMode } from "react-icons/md";
import { useRecoilState } from "recoil";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import DraggableBoard from "./components/DraggableBoard";
import { toDosState } from "./atom";

function App() {
  const [toDos, setToDos] = useRecoilState(toDosState);
  const onDragEnd = (result: DropResult) => {
    //   draggableId:유저가 드래그 하고 있던 객체의 id
    //   source: draggable이 시작한 위치
    //   destination:draggable이 끝난 위치 (리스트 바깥에 drop되는 등 null이 될수도)
    const { destination, source } = result;

    // 유효한 드래그 드롭이 아닌 경우
    if (!destination) return;

    console.log(result);
    

    if (source.droppableId === "boards" && destination?.droppableId === "boards") {
      // 보드 간 이동 처리
      setToDos((prevToDos: any) => {
        const newToDos = [...prevToDos];
        const [removed] = newToDos.splice(source.index, 1);
        newToDos.splice(destination.index, 0, removed);
        return newToDos;
      });
    } else{
      // 카드 내에서의 이동 처리
      const sourceBoardDropId = source.droppableId;
      const destinationBoardDropId = destination?.droppableId;

      // 같은 보드 내에서 이동하는 경우
      if (sourceBoardDropId === destinationBoardDropId) {
        setToDos((prevToDos: any) => {
          const newToDos = [...prevToDos];
          const boardIndex = newToDos.findIndex(
            (board: any) => board.id === source.droppableId
          );
          //불변성 유지를 위해 새로운 객체 생성
          const newBoard = { ...newToDos[boardIndex] }; // 기존 보드 객체 복제
          const taskArr = [...newBoard.toDos]; // to do list 복제
          const [removed] = taskArr.splice(source.index, 1);
          taskArr.splice(destination.index, 0, removed);
          newBoard.toDos = taskArr; // 복제한 to do list 할당
          newToDos[boardIndex] = newBoard; // 업데이트된 보드 객체 할당
          return newToDos;
        });
      }
      // 다른 보드로 이동하는 경우
      else if (sourceBoardDropId !== destinationBoardDropId) {
        setToDos((prevToDos: any) => {
          const newToDos = [...prevToDos];
          //움직임이 시작 된 보드 
          const sourceBoardIndex = newToDos.findIndex(
            (board: any) => board.id === source.droppableId
          );
          //움직임이 끝난 보드
          const destinationBoardIndex = newToDos.findIndex(
            (board: any) => board.id === destination.droppableId
          );

          //보드 복제
          const newSourceBoard = { ...newToDos[sourceBoardIndex] }; 
          const newDestinationBoard = { ...newToDos[destinationBoardIndex] };

          //to do list 복제
          const sourceTaskArr = [...newSourceBoard.toDos];
          const destinationTaskArr = [...newDestinationBoard.toDos];

          const taskToMove = sourceTaskArr.splice(source.index, 1)[0]; // 이동할 태스크 가져오기
          destinationTaskArr.splice(destination.index, 0, taskToMove); // 대상 위치에 태스크 삽입

          //복제한 task array 할당
          newSourceBoard.toDos = sourceTaskArr;
          newDestinationBoard.toDos = destinationTaskArr;

          //업데이트 된 보드 객체 할당
          newToDos[sourceBoardIndex] = newSourceBoard;
          newToDos[destinationBoardIndex] = newDestinationBoard;

          return newToDos; // 수정된 상태 반환
        });
      }
    }
  };

  // 새 보드 추가
  const addNewBoard = () => {
    const newBoard = {
      id: "board" + Date.now(),
      title: "New Board",
      toDos: [], // 새 보드의 할 일 목록을 빈 배열로 초기화
    };
    setToDos((prevToDos: any) => [...prevToDos, newBoard]); // 새 보드를 상태에 추가.
  };

  return (
    <Wrapper>
      <Header>
        <span>To Do List</span>
        <div className="btn-area">
          <button className="btn" onClick={addNewBoard}>
            <HiPlus size="25" />
          </button>
          <button className="btn">
            <MdOutlineDarkMode size="25" />
          </button>
        </div>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" direction="horizontal">
          {(providedDroppable, snapshotDroppable) => (
            <Boards
              ref={providedDroppable.innerRef}
              {...providedDroppable.droppableProps}
            >
              {toDos.map((board, index) => (
                <DraggableBoard
                  board={board}
                  index={index}
                  toDos={board.toDos}
                  key={board.id}
                />
              ))}
              {providedDroppable.placeholder}
            </Boards>
          )}
        </Droppable>
        {/* <Delete>
          <MdDeleteForever size="50" />
        </Delete> */}
      </DragDropContext>
    </Wrapper>
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
      border: 2px solid #ffffff27;
      width: 50px;
      height: 50px;
      margin-right: 10px;
      background-color: ${(props) => props.theme.bgColor};
      color: white;
      &:hover {
        box-shadow: 0px 0px 8px #ffffff27;
        cursor: pointer;
      }
    }
  }
`;

const Delete = styled.div`
  background-color: pink;
  width: 50px;
  overflow: hidden;
  text-align: center;
  color: #cb4335;
  margin: 0 auto;
`;
