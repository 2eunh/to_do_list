import { atom } from "recoil";


export interface IToDo {
	id: number;
	text: string;
}

export interface IBoard {
	id: number;
	title: string;
	toDos: IToDo[];
}

// interface IToDoState {
//   [key: string]: ITodo[];
// }

// interface IToDoState {
//   [key: string]: ITodo[];
// }



export const toDosState = atom<IBoard[]>({
	key: "toDos",
	default: [
		{
			title: "해야 함",
			id: 0,
			toDos: [
				{ text: "빨래 널기", id: 0 },
				{ text: "코로나 검사하기", id: 1 },
				{ text: "책 읽기", id: 2 },
				{ text: "마스크 사기", id: 3 },
				{ text: "커피 마시기", id: 4 },
				{ text: "설거지 하기", id: 5 },
				{ text: "공부하기", id: 6 },
				{ text: "운동하기", id: 7 },
				{ text: "이건 이름이 되게 긴데 마우스를 여기에도 올려보세요", id: 8 }
			],
		},
		{ title: "하는 중", id: 1, toDos: [] },
		{
			title: "끝",
			id: 2,
			toDos: [
				{ text: "은행 다녀오기", id: 27 },
				{ text: "보드나 할 일을 추가해보세요!", id: 28 },
			],
		},
	]
});