import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { TiDeleteOutline } from "react-icons/ti";
import { useRecoilState } from 'recoil';
import { toDoState } from '../atom';


interface IDragabbleCardProps {
  toDoId: string;
  toDoText : string;
  index: number;
  boardId: string;
}


function DraggableCard({ toDoId,toDoText, index, boardId }: IDragabbleCardProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);
  //카드 삭제
  const deleteCard = () => {
    setToDos((allBoards) => {
      const boardCopy = { ...allBoards };
      const updatedBoard = boardCopy[boardId].filter((toDo) => toDo.id !== toDoId);
      return {
        ...allBoards,
        [boardId]: updatedBoard,
      };
    });
  };
  return (
    <Draggable draggableId={String(toDoId)} index={index} key={String(toDoId)}>
      {(cardProvided, snapShot) => (
        <Card
          isDragging = {snapShot.isDragging}
          ref={cardProvided.innerRef}
          {...cardProvided.dragHandleProps}
          {...cardProvided.draggableProps}
          showDelete={showDelete}
          onMouseEnter={() => setShowDelete(true)} // 마우스가 카드에 들어오면 삭제 버튼 표시
          onMouseLeave={() => setShowDelete(false)} // 마우스가 카드를 떠나면 삭제 버튼 숨김
        >
          <span>
            {toDoText}
          </span>
          <span className='del' onClick={deleteCard}>
            <TiDeleteOutline size="23" />
          </span>
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);



const Card = styled.div<{isDragging : boolean; showDelete: boolean}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 7px;
  margin-bottom: 10px;
  padding: 15px;
  font-size: 15px;
  min-height: 60px;
  max-height: 82px;
  background-color: ${(props) => props.isDragging? "#CACFD2" : props.theme.cardColor};
  box-shadow: ${props => props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
  .del {
    opacity: 0;
    visibility: hidden;
    cursor: pointer;
    color: #c6cacd;
    transition: opacity 0.5s, visibility 0.5s;
    &:hover {
      color: #a1a5a9;
    }
  }
  &:hover .del {
    opacity: 1;
    visibility: visible;
  }
`;