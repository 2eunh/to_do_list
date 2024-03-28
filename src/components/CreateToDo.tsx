import React from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState } from "./atom";

interface IForm {
  toDo: string;
}


function CreateToDo () {
  const setToDos = useSetRecoilState(toDoState);
  const {register, handleSubmit, setValue} = useForm<IForm>();
  const handleValid = ({toDo} : IForm) => {
    setToDos(oldToDos => [{text : toDo,id: Date.now(), category: "TO_DO"},...oldToDos]) /// ...oldToDos -> 배열안의 요소를 반환
    setValue("toDo", "");
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
        <input
          {...register("toDo", {
            required: "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        
      <button>Add</button>
    </form>
  );
}


export default CreateToDo;