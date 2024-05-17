import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';


interface IDragabbleCardProps {
  toDoId: string;
  toDoText : string;
  index: number;
}


function DraggableCard({ toDoId,toDoText, index }: IDragabbleCardProps) {
  return (
    <Draggable draggableId={String(toDoId)} index={index}>
      {(cardProvided, snapShot) => (
        <Card
          isDragging = {snapShot.isDragging}
          ref={cardProvided.innerRef}
          {...cardProvided.dragHandleProps}
          {...cardProvided.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);



const Card = styled.div<{isDragging : boolean}>`
  border-radius: 7px;
  margin-bottom: 10px;
  padding: 15px 10px;
  font-size: 15px;
  background-color: ${(props) => props.isDragging? "#CACFD2" : props.theme.cardColor};
  box-shadow: ${props => props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
`;