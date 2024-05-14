import React, { Component, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { IToDo, toDosState } from "../atom";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { HiPencil } from "react-icons/hi2";
import { RxDragHandleDots2 } from "react-icons/rx";
import DraggableCard from "./DraggableCard";
import { useSetRecoilState } from "recoil";



interface IForm {
  toDo: string;
}

interface IBoardProps {
  toDos: IToDo[];
  board: any;
  index: number;
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

function DraggableBoard({ toDos, board, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDosState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onValid = ({ toDo }: IForm) => {
    const newToDo: IToDo = {
      id: Date.now().toString(),
      text: toDo,
    };
  
    // 새로운 할 일을 추가
    setToDos(prevToDos => {
      const updatedToDos = prevToDos.map(prevBoard => {
        if (prevBoard.id === board.id) {
          return {
            ...prevBoard,
            toDos: [ newToDo, ...prevBoard.toDos],
          };
        }
        return prevBoard;
      });
      return updatedToDos;
    });
  
    // 입력 필드를 초기화
    setValue("toDo", "");
  };
  

  return (
    <Draggable draggableId={board.id} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <Top isDragging={snapshot.isDragging}>
            <TitleInput
              type="text"
              defaultValue={board.title}
              disabled={!isEditing}
              ref={inputRef}
              isDragging={snapshot.isDragging}
            />
            <div className="btn-area">
              <button onClick={toggleEditing}>
                <HiPencil size="20" />
              </button>
              <span {...provided.dragHandleProps}>
                <RxDragHandleDots2 size="25" />
              </span>
            </div>
          </Top>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add a new task to ${board.title}.`}
            />
          </Form>
          <CardWrapper>
            <Droppable droppableId={board.id}>
              {(droppableProvided, droppableSnapshot) => (
                <Area
                  isDraggingOver={droppableSnapshot.isDraggingOver}
                  isDraggingFromThis={!!droppableSnapshot.draggingFromThisWith}
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {toDos.map((toDo, index) => (
                    <DraggableCard
                      key={toDo.id}
                      index={index}
                      toDoId={toDo.id}
                      toDoText={toDo.text}
                    />
                  ))}
                  {droppableProvided.placeholder}
                </Area>
              )}
            </Droppable>
          </CardWrapper>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableBoard);


const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) =>
    props.isDragging ? props.theme.boardDraggingColor : props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  margin: 10px 1%;
  min-height: 65%;
  max-height: 65%;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
  input {
    width: 90%;
    height: 35px;
    border: none;
    border-radius: 10px;
    padding: 0 10px;
    outline: none;
    background-color: ${(props) => props.theme.titleColor} ;
  }
`;

const Top = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 3px 13px;
  margin-bottom: 15px;
  .btn-area {
    display: flex;
    button {
      background-color: ${(props) =>
        props.isDragging ? props.theme.boardDraggingColor : props.theme.boardColor};
      border: none;
      margin-right: 5px;
      &:hover {
        cursor: pointer;
      }
    }
    span,
    button {
      color: ${(props) => props.theme.boardIconColor};
      &:hover {
        color: ${(props) => props.theme.boardTitleColor};
      }
    }
  }
`;

const TitleInput = styled.input<{ isDragging: boolean }>`
  border: none;
  background-color: ${(props) =>
    props.isDragging ? props.theme.boardDraggingColor : props.theme.boardColor};
  color: ${(props) => props.theme.boardTitleColor};
  font-size: 20px;
  font-weight: 600;
  width: 70%;
`;


const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
  props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;

`;
const CardWrapper = styled.div`
  height: 100%;
  overflow: auto;
  margin-top: 10px;
  /* 스크롤바의 폭 너비 */
  &::-webkit-scrollbar {
    width: 10px;  
  }
  &::-webkit-scrollbar-thumb {
    background: #4d4d5170 ; /* 스크롤바 색상 */
    border-radius: 10px; /* 스크롤바 둥근 테두리 */
  }
  &::-webkit-scrollbar-track {
    background: #1c1c1d25;  /*스크롤바 뒷 배경 색상*/
  }
`;



