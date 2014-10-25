

module mag.data {
	export class Question {
		wordId: number;
		isLang1: boolean;
		question: string;
		answer: string;
		isAnswered = false;
		isCorrect: boolean;
	}
}