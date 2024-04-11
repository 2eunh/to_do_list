import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "./atom";
import styled from "styled-components";


const Input = styled.input`
  width: 500px;
  height: 35px;
  border-radius: 10px;
  border: 0;
  outline: none;
  padding-left: 10px;
`;
const Button = styled.button`
  border: 0;
  border-radius: 10px;
  margin-left: 10px;
  width: 50px;
  height: 35px;
  background-color: #b0a6a6;
  &:hover{
    cursor: pointer;
    background-color: #b0a6a68f;
  }
`;

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ]); /// ...oldToDos -> 배열안의 요소를 반환
    setValue("toDo", "");
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <form onSubmit={handleSubmit(handleValid)}>
        <Input
          {...register("toDo", {
            required: "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        <Button>Add</Button>
      </form>
    </div>
  );
}

export default CreateToDo;


