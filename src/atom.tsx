import { atom } from "recoil";

// const { persistAtom } = recoilPersist(); //상태관리

export interface IToDo {
  id: string;
  text: string;
}

// export interface IBoard {
//   id: string;
//   title: string;
//   // toDos: IToDo[];
// }

interface IToDoState {
  [key: string]: IToDo[];
}

export const BoardState = atom<string[]>({
  key: 'boards',
  default: ['To Do', 'Doing', 'Done'],
});

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': [
      {
        id : "123",
        text : "코딩 공부하기"
      }
    ],
    Doing: [],
    Done: []
  },
});


export const deleteSatate = atom<boolean>({
  key: 'delete',
  default: false,
});




// export const toDosState = atom<IBoard[]>({
//   key: "toDos",
//   default: [
//     {
//       title: "To Do",
//       id: "0",
//       toDos: [],
//     },
//     { 
// 			title: "Doing", 
// 			id: "ff", 
// 			toDos: [] 
// 		},
//     {
//       title: "Done",
//       id: "2",
//       toDos: [],
//     },
//   ],
// });

