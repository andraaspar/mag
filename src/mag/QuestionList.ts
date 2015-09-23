/// <reference path='Question.ts'/>

module mag {
	export class QuestionList {
		startTime: number;
		endTime: number;
		currentQuestionId: number;
		questions: Question[];
	}
}