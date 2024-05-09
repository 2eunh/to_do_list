import React, { Component, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IToDo } from '../atom';
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable } from 'react-beautiful-dnd';
import { HiPencil } from "react-icons/hi2";
import { RxDragHandleDots2 } from "react-icons/rx";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  margin: 10px 25px;
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
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3px 13px;
  margin-bottom: 10px;
  .btn-area {
    display: flex;
    button {
      background-color:${(props) => props.theme.boardColor};
      border: none;
      margin-right: 5px;
      &:hover{
        cursor: pointer;
      }
    }
    span, button{
      color: ${(props) => props.theme.boardIconColor};
      &:hover{
        color: ${(props) => props.theme.boardTitleColor};
      }
    }
  }
`;

const TitleInput = styled.input`
  border: none;
  background-color:${(props) => props.theme.boardColor};
  color: ${(props) => props.theme.boardTitleColor};
  font-size: 20px;
  font-weight: 600;
  width: 70%;
`;

interface IForm {
  toDo : string;
}

interface IBoardProps {
  toDos: IToDo[];
  board: any;
  index : number;
}




function DraggableBoard({ toDos, board, index }: IBoardProps) {
  const { register, handleSubmit } = useForm<IForm>();
  const [isEditing, setIsEditing] = useState(false); // TitleInput이 활성화되었는지 여부
  const inputRef = useRef<HTMLInputElement | null>(null); // TitleInput의 ref

  const toggleEditing = () => {
    if (!isEditing) {
      setIsEditing(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setIsEditing(false);
    }
  };

  const onValid = ({ toDo }: IForm) => {
    // 수정된 내용 처리
    setIsEditing(false); // 수정 후 비활성화
  };

  return (
    <Draggable draggableId={String(board.id)} index={index}>
      {(provided, snapshot) => (
        <Wrapper {...provided.draggableProps} ref={provided.innerRef}>
          <Top>
            <TitleInput
              type="text"
              value={board.title}
              readOnly={!isEditing} // isEditing 값에 따라 readOnly 설정
              ref={inputRef} // ref 설정
              onFocus={() => setIsEditing(true)} // 포커스되면 수정 상태로 변경
            />
            <div className='btn-area'>
              <button onClick={toggleEditing}><HiPencil size="20" /></button> {/* 수정 버튼 */}
              <span {...provided.dragHandleProps}><RxDragHandleDots2 size="25" /></span>
            </div>
          </Top>
          <Form onSubmit={handleSubmit(onValid)}>
            <input {...register("toDo", { required: true })} type="text" placeholder={`${board.title}을(를) 입력해주세요.`} />
          </Form>
          {/* 추가로 렌더링할 내용이 있다면 여기에 추가 */}
        </Wrapper>
      )}
    </Draggable>
  );
}


export default DraggableBoard;

