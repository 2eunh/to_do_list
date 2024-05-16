import { atom } from "recoil";

// const { persistAtom } = recoilPersist(); //상태관리

export interface IToDo {
  id: string;
  text: string;
}

export interface IBoard {
  id: string;
  title: string;
  toDos: IToDo[];
}

interface IToDoState {
  [key: string]: IToDo[];
}


export const toDosState = atom<IBoard[]>({
  key: "toDos",
  default: [
    {
      title: "To Do",
      id: "0",
      toDos: [
      ],
    },
    { title: "Doing", id: "ff", toDos: [] },
    {
      title: "Done",
      id: "2",
      toDos: [
			],
    },
  ],
});

