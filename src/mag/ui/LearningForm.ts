/// <reference path='../data/QuestionList.ts'/>

/// <reference path='../util/WordlistOptionRenderer.ts'/>

/// <reference path='WordlistSelectorForm.ts'/>

module mag.ui {
	export enum LearningFormState {
		NO_STATE, NOT_STARTED, STARTED
	}

	export class LearningForm extends WordlistSelectorForm {
		
		static EVENT_STATE_CHANGED = 'mag_ui_LearningForm_EVENT_STATE_CHANGED';

		private resultsSection = jQuery('#results');
		private resultsQuestionCountOut = jQuery('#results-question-count');
		private resultsCorrectAnswersCountOut = jQuery('#results-correct-answers-count');
		private resultsFailedAnswersCountOut = jQuery('#results-failed-answers-count');
		private resultsPercentOut = jQuery('#results-percent');
		private resultsTextOut = jQuery('#results-text');
		private resultsDropCountOut = jQuery('#results-drop-count');
		private resultsRemainingCountOut = jQuery('#results-remaining-count');

		private startLearningSection = jQuery('#start-learning');
		private notificationsStartLearning = new Notifications(jQuery('#notifications-start-learning'));
		private startLearningButton = jQuery('#start-learning-button');

		private learningSection = jQuery('#learning');
		
		private learningListNameOut = jQuery('#learning-list-name-out');

		private learningLang1InLabel = jQuery('#learning-lang1-in-label');
		private learningLang1Static = jQuery('#learning-lang1-static');
		private learningLang1In = jQuery('#learning-lang1-in');
		private learningLang1Ok = jQuery('#learning-lang1-ok');

		private learningLang2InLabel = jQuery('#learning-lang2-in-label');
		private learningLang2Static = jQuery('#learning-lang2-static');
		private learningLang2In = jQuery('#learning-lang2-in');
		private learningLang2Ok = jQuery('#learning-lang2-ok');

		private learningOkButton = jQuery('#learning-ok-button');
		private learningDontKnowButton = jQuery('#learning-dont-know-button');
		private learningQuitButton = jQuery('#learning-quit-button');

		private learningProgressBar = jQuery('#learning-progress-bar');

		private state = LearningFormState.NO_STATE;
		
		private questionList: data.QuestionList;
		
		private isCorrect: boolean;
		private percent = NaN;
		private dropCount = NaN;
		private remainingCount = NaN;
		private correctAnswersCount = NaN;
		private failedAnswersCount = NaN;
		
		private saveWordlistTransaction: adat.Transaction;

		constructor() {
			super('#learning-list-select');
			
			this.startLearningButton.on('click', illa.bind(this.onStartLearningButtonClicked, this));
			this.learningQuitButton.on('click', illa.bind(this.onLearningQuitButtonClicked, this));
			this.learningLang1In.on('input', illa.bind(this.onInputChanged, this));
			this.learningLang2In.on('input', illa.bind(this.onInputChanged, this));
			this.learningLang1In.on('keyup', illa.bind(this.onInputKeyUp, this));
			this.learningLang2In.on('keyup', illa.bind(this.onInputKeyUp, this));
			this.learningOkButton.on('click', illa.bind(this.onOkClicked, this));
			this.learningDontKnowButton.on('click', illa.bind(this.onDontKnowClicked, this));
		}
		
		showRemainingCountNotification(): void {
			this.remainingCount = this.calculateRemainingCount();
			var wordlist = Main.getInstance().getSelectedWordlist();
			if (!isNaN(this.remainingCount) && wordlist.words.length) {
				if (this.remainingCount) {
					this.notificationsStartLearning.message('Maradt még %1% szavam, vágjunk bele!'.replace(
						/%1%/g, this.remainingCount + ''));
				} else {
					this.notificationsStartLearning.success('Nincs egy szavam se, mindent megtanultál!');
				}
			}
		}
		
		onWordlistsLoaded(e: illa.Event): void {
			super.onWordlistsLoaded(e);
			this.notificationsStartLearning.removeAll();
			this.showRemainingCountNotification();
			this.setState(LearningFormState.NOT_STARTED);
		}
		
		onSelectedWordlistChanged(e: illa.Event): void {
			super.onSelectedWordlistChanged(e);
			this.notificationsStartLearning.removeAll();
			this.showRemainingCountNotification();
			this.setState(LearningFormState.NOT_STARTED);
		}
		
		onSelected(e: jQuery.IEvent): void {
			super.onSelected(e);
			this.notificationsStartLearning.removeAll();
			this.showRemainingCountNotification();
		}
		
		getState() { return this.state }

		setState(value: LearningFormState): void {
			if (this.state == value) return;
			
			this.state = value;
			
			this.notificationsStartLearning.removeAll();
			
			switch (value) {
				case LearningFormState.NOT_STARTED:
					
					this.showRemainingCountNotification();
					
					this.resultsSection.toggle(!isNaN(this.percent));
					this.resultsQuestionCountOut.text(this.getQuestionCount());
					this.resultsCorrectAnswersCountOut.text(this.correctAnswersCount);
					this.resultsFailedAnswersCountOut.text(this.failedAnswersCount);
					this.resultsPercentOut.text(this.percent + '%');
					this.resultsTextOut.text(this.getResultsText(this.percent));
					this.resultsDropCountOut.text(this.dropCount);
					this.resultsRemainingCountOut.text(this.remainingCount);
					
					this.startLearningSection.show();
					
					this.learningSection.hide();
					break;
				case LearningFormState.STARTED:
					
					this.resultsSection.hide();
					
					this.startLearningSection.hide();
					
					this.learningSection.show();
					
					var wordlist = Main.getInstance().getSelectedWordlist();
					this.learningListNameOut.text(wordlist.name);
					this.learningLang1InLabel.text(wordlist.lang1Name);
					this.learningLang2InLabel.text(wordlist.lang2Name);
					
					this.correctAnswersCount = 0;
					
					this.questionList = this.createQuestionList();
					this.renderNextQuestion();
					break;
			}
			
			new illa.Event(LearningForm.EVENT_STATE_CHANGED, this).dispatch();
		}
		
		onStartLearningButtonClicked(e: jQuery.IEvent): void {
			if (Main.getInstance().getSelectedWordlist()) {
				this.setState(LearningFormState.STARTED);
			} else {
				this.notificationsStartLearning.error('Válassz egy szólistát előbb!');
			}
		}
		
		onLearningQuitButtonClicked(e: jQuery.IEvent): void {
			this.percent = NaN;
			this.setState(LearningFormState.NOT_STARTED);
			this.notificationsStartLearning.warning('Félbehagytad a tanulást!');
		}
		
		createQuestionList(): data.QuestionList {
			var result = new data.QuestionList();
			var wordlist = Main.getInstance().getSelectedWordlist();
			var questions: data.Question[] = [];
			
			for (var i = 0, n = wordlist.words.length; i < n; i++) {
				var word = wordlist.words[i];
				if (word.lang1Count) {
					var question = new data.Question();
					question.wordId = i;
					question.isLang1 = true;
					question.question = word.lang2;
					question.answer = word.lang1;
					questions.push(question);
				}
				if (word.lang2Count) {
					var question = new data.Question();
					question.wordId = i;
					question.isLang1 = false;
					question.question = word.lang1;
					question.answer = word.lang2;
					questions.push(question);
				}
			}
			
			while (questions.length) {
				var index = Math.floor(Math.random() * questions.length);
				result.questions.push(questions.splice(index, 1)[0]);
			}
			
			return result;
		}
		
		renderNextQuestion(): void {
			var question = this.questionList.questions[++this.questionList.currentQuestionId];
			
			if (question) {
				this.learningLang1In.toggle(question.isLang1).val('');
				this.learningLang2In.toggle(!question.isLang1).val('');
				this.learningLang1Static.toggle(!question.isLang1).text(question.question);
				this.learningLang2Static.toggle(question.isLang1).text(question.question);
				var progressPercent = Math.round((this.questionList.currentQuestionId + 1) / this.questionList.questions.length * 100);
				this.learningProgressBar.css('width', progressPercent + '%').text(progressPercent + '%').attr('aria-valuenow', progressPercent);
				this.onInputChanged();
				this.getCurrentInput().focus();
			} else {
				this.onEndReached();
			}
		}
		
		onInputChanged(e?: jQuery.IEvent): void {
			this.isCorrect = illa.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(this.getCurrentInput().val())) ===
				this.getCurrentQuestion().answer;
			this.getCurrentOk().toggle(this.isCorrect);
			this.getOtherOk().hide();
			this.getCurrentFormGroup().toggleClass('has-success', this.isCorrect);
			this.getOtherFormGroup().removeClass('has-success');
			this.learningOkButton.prop('disabled', !this.isCorrect);
			this.learningDontKnowButton.prop('disabled', this.isCorrect);
		}
		
		onInputKeyUp(e: jQuery.IEvent): void {
			if (this.isCorrect) {
				if (e.which === 13) {
					this.onOkClicked();
				}
			}
		}
		
		onOkClicked(e?: jQuery.IEvent): void {
			var question = this.getCurrentQuestion();
			if (!question.isAnswered) {
				question.isAnswered = true;
				question.isCorrect = true;
			}
			this.renderNextQuestion();
		}
		
		onDontKnowClicked(e: jQuery.IEvent): void {
			var question = this.getCurrentQuestion();
			question.isAnswered = true;
			question.isCorrect = false;
			this.getCurrentInput().val(question.answer);
			this.onInputChanged();
		}
		
		onEndReached(): void {
			this.dropCount = 0;
			this.correctAnswersCount = 0;
			var wordlist = Main.getInstance().getSelectedWordlist();
			for (var i = this.questionList.questions.length - 1; i >= 0; i--) {
				var question = this.questionList.questions[i];
				var word = wordlist.words[question.wordId];
				if (question.isCorrect) {
					this.correctAnswersCount++;
					if (question.isLang1) {
						if (--word.lang1Count == 0) {
							this.dropCount++;
						}
					} else {
						if (--word.lang2Count == 0) {
							this.dropCount++;
						}
					}
				} else {
					if (question.isLang1) {
						Math.max(++word.lang1Count, Main.PRACTICE_COUNT_MAX);
					} else {
						Math.max(++word.lang2Count, Main.PRACTICE_COUNT_MAX);
					}
				}
			}
			this.failedAnswersCount = this.questionList.questions.length - this.correctAnswersCount;
			this.remainingCount = this.questionList.questions.length - this.dropCount;
			this.percent = Math.round(this.correctAnswersCount / this.questionList.questions.length * 100);
			
			this.saveWordlistTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.saveWordlistTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onErrorSavingWordlist, this);
			this.saveWordlistTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordlistSaved, this);
			this.saveWordlistTransaction.process();
		}
		
		calculateRemainingCount(): number {
			var result = NaN;
			var wordlist = Main.getInstance().getSelectedWordlist();
			if (wordlist) {
				result = 0;
				for (var i = wordlist.words.length - 1; i >= 0; i--) {
					var word = wordlist.words[i];
					if (word.lang1Count) result++;
					if (word.lang2Count) result++;
				}
			}
			return result;
		}
		
		getResultsText(percent: number): string {
			if (percent == 100) {
				return 'Tökéletes! Nagyon ügyes voltál!';
			} else if (percent >= 95) {
				return 'Ez igen! Nagyon ügyes voltál!';
			} else if (percent >= 90) {
				return 'Nagyon szép eredmény!';
			} else if (percent >= 80) {
				return 'Szép eredmény!';
			} else if (percent >= 70) {
				return 'Jól megy, csak így tovább!';
			} else if (percent >= 60) {
				return 'Egész jó, folytasd csak!';
			} else if (percent >= 50) {
				return 'A fele megvolt, na mégegyszer!';
			} else if (percent >= 40) {
				return 'Csak egy kicsi kellett volna a feléhez! Próbáld újra!';
			} else if (percent >= 30) {
				return 'A harmada megvan! Próbáld újra!';
			} else if (percent >= 20) {
				return 'Kezdetnek megteszi. Próbáld újra!';
			} else if (percent >= 10) {
				return 'Ne csüggedj, próbáld újra!';
			} else if (percent > 0) {
				return 'Párat azért eltaláltál. Próbáld újra!';
			} else {
				return 'Minden kezdet nehéz... Próbáld meg újra!';
			}
		}
		
		onErrorSavingWordlist(e: illa.Event): void {
			this.setState(LearningFormState.NOT_STARTED);
			this.notificationsStartLearning.error('Hiba történt! Nem tudtam lementeni a szólistát!');
		}
		
		onWordlistSaved(e: illa.Event): void {
			Main.getInstance().refreshWordlists();
		}
		
		getQuestionCount() { return this.questionList ? this.questionList.questions.length : 0 }
		getCurrentQuestion() { return this.questionList ? this.questionList.questions[this.questionList.currentQuestionId] : null }
		getCurrentInput() { return this.getCurrentQuestion().isLang1 ? this.learningLang1In : this.learningLang2In }
		getOtherInput() { return this.getCurrentQuestion().isLang1 ? this.learningLang2In : this.learningLang1In }
		getCurrentFormGroup() { return this.getCurrentInput().closest('.form-group') }
		getOtherFormGroup() { return this.getOtherInput().closest('.form-group') }
		getCurrentOk() { return this.getCurrentQuestion().isLang1 ? this.learningLang1Ok : this.learningLang2Ok }
		getOtherOk() { return this.getCurrentQuestion().isLang1 ? this.learningLang2Ok : this.learningLang1Ok }
	}
}