import styled from "styled-components";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDarkMode } from "react-icons/md";
import { useRecoilState } from "recoil";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import DraggableBoard from "./components/DraggableBoard";
import { toDosState } from "./atom";

const Boards = styled.div`
  display: flex;
  background-color: grey;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding: 10px;
  /* display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh; */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 10px;
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


function App() {
  const [toDos, setToDos] = useRecoilState(toDosState);
  const onDragEnd = (result: DropResult) => {
    console.log(result);
    //   draggableId:유저가 드래그 하고 있던 객체의 id
    //   source: draggable이 시작한 위치
    //   destination:draggable이 끝난 위치 (리스트 바깥에 drop되는 등 null이 될수도)
    const { destination, draggableId, source } = result;

    // 유효한 드래그 드롭이 아닌 경우
    if (!destination) return;


    //board movement
    setToDos(prevToDos => {
      const newToDos = [...prevToDos];
      const [removed] = newToDos.splice(source.index, 1);
      newToDos.splice(destination.index, 0, removed);
      return newToDos;
    });
  };

  return (
    <>
      <Header>
        <span>To Do List</span>
        <div className="btn-area">
          <button className="btn">
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
            <Boards ref={providedDroppable.innerRef} {...providedDroppable.droppableProps}>
              {toDos.map((board, index) => (
                <DraggableBoard
                  board={board}
                  index={index}
                  toDos={[]}
                  key={board.id}
                />
              ))}
              {providedDroppable.placeholder}
            </Boards>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default App;
