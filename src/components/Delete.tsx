import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { deleteSatate } from '../atom';
import styled from 'styled-components';
import { MdDeleteForever } from "react-icons/md";

function Delete(  ){
  const deleted = useRecoilValue(deleteSatate);
  return (
    <Droppable droppableId="delete">
      {(provided) => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          {deleted && (
            <MdDeleteForever size="50" />
          )} 
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default Delete;

const Wrapper = styled.div`
  width: 55px;
  height: 55px;
  overflow: hidden;
  color: #A6ACAF ;
  float: right;
  padding: 2px;
`;
