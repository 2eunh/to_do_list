import React, { Component, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { IToDo, toDoState } from "../atom";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { HiPencil } from "react-icons/hi2";
import { RxDragHandleDots2 } from "react-icons/rx";
import DraggableCard from "./DraggableCard";
import { useSetRecoilState } from "recoil";
import Delete from "./Delete";



interface IForm {
  toDo: string;
}

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

function DraggableBoard({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
  });


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
    clearErrors();
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards : any) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };

  const onTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue("toDo", newValue + "를(을) 추가해주세요.");
  };

  

  return (
    <Draggable draggableId={boardId} index={index} key={boardId}>
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <Top isDragging={snapshot.isDragging}>
            <TitleInput
              type="text"
              defaultValue={boardId}
              disabled={!isEditing}
              ref={inputRef}
              isDragging={snapshot.isDragging}
              onChange={onTitleInputChange}
              maxLength={10}
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
              {...register("toDo", { required: true, maxLength: 50 })} // 최대 글자 수를 50으로 제한
              type="text"
              autoComplete="off"
              placeholder={`${boardId}를(을) 추가해주세요..`}
            />
            {errors.toDo && errors.toDo.type === "maxLength" && (
              <Error>최대 50글자까지 입력 가능합니다.</Error>
            )}
          </Form>
          <CardWrapper>
            <Droppable droppableId={boardId} type="card">
              {(droppableProvided, droppableSnapshot) => (
                <Area
                  isDraggingOver={droppableSnapshot.isDraggingOver}
                  isDraggingFromThis={Boolean(droppableSnapshot.draggingFromThisWith)}
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {toDos.map((toDo, index) => (
                    <DraggableCard
                      key={toDo.id}
                      index={index}
                      toDoId={toDo.id}
                      toDoText={toDo.text}
                      boardId={boardId}
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
  min-height: 550px;
  max-height: 550px;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
  input {
    width: 90%;
    height: 40px;
    border: none;
    border-radius: 10px;
    padding: 0 10px;
    outline: none;
    background-color: ${(props) => props.theme.boardInputColor} ;
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
        color: #000000cc;
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
  /* background-color: ${(props) =>
  props.isDraggingOver ? props.theme.boardDraggingColor : props.isDraggingFromThis ? "" : "transparent"}; */
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;

`;
const CardWrapper = styled.div`
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
const Error = styled.p`
  color: #C0392B;
  margin-top: 7px;
  font-size: 13px;
`;



