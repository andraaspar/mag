/// <reference path='Question.ts'/>

module mag.data {
	export class QuestionList {
		startTime: number;
		endTime: number;
		currentQuestionId = -1;
		questions: Question[] = [];
	}
}