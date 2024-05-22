import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist(); //상태관리

export interface IToDo {
  id: string;
  text: string;
}


export interface IToDoState {
  [key: string]: IToDo[];
}

export const BoardState = atom<string[]>({
  key: 'boards',
  default: ['To Do', 'Doing', 'Done'],
  effects_UNSTABLE: [persistAtom],
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
  effects_UNSTABLE: [persistAtom],
});


export const deleteSatate = atom<boolean>({
  key: 'delete',
  default: false,
});


