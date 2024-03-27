import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

/* function ToDoList() {
  const [toDo, setToDo] = useState("");
  const [toDoError, setToDoError] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setToDoError("");
    setToDo(value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(toDo);
    if (toDo.length < 10) {
      return setToDoError("To do should be longer");
    }
    console.log("submit");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={toDo} placeholder="Write a to do" />
        <button>Add</button>
        {toDoError !== "" ? toDoError : null}
      </form>
    </div>
  );
} */




interface IForm {
  toDo: string;
}

interface IToDo {
  text: string;
  id : number;
  category: "TO_DO" | "DOING" | "DONE";
}

const toDoState = atom<IToDo[]>({
  key : "toDo",
  default : []
});

function ToDoList() {
  // const value = useRecoilValue(toDoState); //atom의 값을 불러오고
  // const modFn = useSetRecoilState(toDoState);  //atom의 값을 수정가능
  // => 아래와 같이 쓸 수 있음
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({toDo} : IForm) => {
    setToDos(oldToDos => [{text : toDo,id: Date.now(), category: "TO_DO"},...oldToDos]) /// ...oldToDos -> 배열안의 요소를 반환
    setValue("toDo", "");
  };
  console.log(toDos);
  
  return (
    <div>
      <h1>To Do</h1>
      <hr/>
      <form onSubmit={handleSubmit(handleValid)}>
        <input
          {...register("toDo", {
            required: "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        
        <button>Add</button>
      </form>
      <ul>
        {toDos.map(toDo => (
          <li key={toDo.id}>{toDo.text}</li>
        ))}
      </ul>
    </div>
  );
}


export default ToDoList;



///////////register와 watch///////////////
// register: name, onBlur, onChange, onClick, ref를 return하는 함수
// -< input {...register("category") ... > 하면 register 함수가 반환하는 객체를 input의 props로 사용할 수 있음.
// -< input onSubmit={} onClick={} onBlur={} > 같은 느낌..?
// watch: form의 입력값들의 변화를 (실시간) 관찰할 수 있게 해주는 함수


// register: (name: string, RegisterOptions?) => ({ onChange, onBlur, name, ref })
// 이 메서드를 사용하면 input을 등록하거나 element를 선택하고 유효성 검사 규칙을 React Hook Form에 적용할 수 있습니다.
// 유효성 검사 규칙은 모두 HTML 표준을 기반으로 하며 사용자 지정 유효성 검사 방법도 허용합니다.

// watch: (names?: string | string[] | (data, options) => void) => unknown
// input의 변화를 구독합니다. 이 메서드는 지정된 input을 감시하고 해당 값을 반환합니다. input 값을 렌더링하고 조건에 따라 무엇을 렌더링할지 결정하는 데 유용합니다.



///////userRecoilState
// useRecoilState(state)

// 첫 요소가 상태의 값이며, 두번째 요소가 호출되었을 때 주어진 값을 업데이트하는 setter 함수인 튜플을 리턴합니다.
// 이 hook은 암묵적으로 주어진 상태에 컴포넌트를 구독합니다.
// ```
// const [tempF, setTempF] = useRecoilState(tempFahrenheit);
// ```
// https://recoiljs.org/ko/docs/api-reference/core/useRecoilState/

// useRecoilValue: state값을 리턴
// useSetRecoilState: setter 함수를 리턴
// useRecoilState: state, setter 함수를 모두 리턴