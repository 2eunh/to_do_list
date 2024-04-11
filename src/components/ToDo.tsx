import React from "react";
import { Categories, IToDo, toDoState } from "./atom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const List = styled.div`
  background-color: #dedee9;
  width: 500px;
  border-radius: 10px;
  padding: 15px;
  margin: 15px;
  span{
    color: black;
  }
`;


function ToDo({ text, category , id}: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
      const newToDo = {text, id , category: name as IToDo["category"] };
      const newTodos = [...oldToDos]; // create new array
      newTodos.splice(targetIndex, 1, newToDo);
      return newTodos;
    });
  };
  const delList = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToDos((oldToDos) => oldToDos.filter((toDo) => toDo.id !== id));
  };
  return (
      <List>
        <span>{text}</span>
        {category !== Categories.DOING && (
          <button name={Categories.DOING} onClick={onClick}>
            Doing
          </button>
        )}
        {category !== Categories.TO_DO && (
          <button name={Categories.TO_DO} onClick={onClick}>
            To Do
          </button>
        )}
        {category !== Categories.DONE && (
          <button name={Categories.DONE} onClick={onClick}>
            Done
          </button>
        )}
        <button onClick = {delList}>Delete</button>
      </List>
  );
}

export default ToDo;
