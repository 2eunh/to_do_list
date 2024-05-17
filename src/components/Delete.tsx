import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { deleteSatate } from '../atom';
import styled from 'styled-components';
import { MdDeleteForever } from "react-icons/md";

function Delete(){
  const deleted = useRecoilValue(deleteSatate);
  return (
    <Droppable droppableId="delete">
      {(provided) => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          {deleted && (
            <span className="delete">
              <span></span>
              <MdDeleteForever size="25" />
            </span>
          )}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default Delete;

const Wrapper = styled.div`
  background-color: pink;
  width: 50px;
  overflow: hidden;
  text-align: center;
  color: #cb4335;
  margin: 0 auto;
`;
