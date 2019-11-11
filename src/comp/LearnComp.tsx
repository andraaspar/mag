import React, { FormEvent, useContext, useRef, useState } from 'react'
import { sanitizeString } from '../function/sanitizeString'
import { Dictionary } from '../model/Dictionary'
import { Word } from '../model/Word'
import { getDb, STORE_DICTIONARIES, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { updateDictionaryCount } from '../storage/updateDictionaryCount'
import { ButtonRowComp } from './ButtonRowComp'
import { ContentRowComp } from './ContentRowComp'
import { FormRowComp } from './FormRowComp'
import { LabelComp } from './LabelComp'
import { ShieldContext } from './ShieldContext'

export interface LearnCompProps {
	_dictionary: Dictionary
	_word: Word
	_translationId: 0 | 1
	_next: (p: { success: boolean }) => void
}

export function LearnComp({
	_dictionary,
	_word,
	_translationId,
	_next,
}: LearnCompProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const questionLanguage =
		_translationId === 0 ? _dictionary.language0 : _dictionary.language1
	const answerLanguage =
		_translationId === 0 ? _dictionary.language1 : _dictionary.language0
	const question =
		_translationId === 0 ? _word.translation0 : _word.translation1
	const correctAnswer = (_translationId === 0
		? _word.translation1
		: _word.translation0
	).text
	const [$answer, set$answer] = useState('')
	const isAnswerCorrect = sanitizeString($answer) === correctAnswer
	const [$answerShown, set$answerShown] = useState(false)
	const { showShield, hideShield } = useContext(ShieldContext)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		const newCount = Math.min(3, question.count + ($answerShown ? 1 : -1))
		showShield('q0t1q5')
		const t = getDb().transaction(
			[STORE_DICTIONARIES, STORE_WORDS],
			'readwrite',
		)
		await storeWord({
			t,
			word: {
				..._word,
				...(_translationId === 0
					? {
							translation0: {
								..._word.translation0,
								count: newCount,
							},
					  }
					: {
							translation1: {
								..._word.translation1,
								count: newCount,
							},
					  }),
			},
		})
		await updateDictionaryCount({ t, dictionaryId: _word.dictionaryId })
		hideShield('q0t1q5')
		set$answerShown(false)
		set$answer('')
		_next({ success: newCount === 0 })
	}

	function onShowAnswer() {
		if (correctAnswer == null) return
		set$answerShown(true)
		set$answer(correctAnswer)
		inputRef.current!.focus()
	}

	return (
		<form onSubmit={onSubmit}>
			<ContentRowComp>
				<div>
					{questionLanguage}: {question.text}
				</div>
				{question.description && (
					<div>Megjegyzés: {question.description}</div>
				)}
				<FormRowComp>
					<LabelComp _required>{answerLanguage}</LabelComp>
					<input
						ref={inputRef}
						autoFocus
						value={$answer}
						onChange={e => {
							set$answer(e.target.value)
						}}
					/>
				</FormRowComp>
				<ButtonRowComp>
					<button disabled={!isAnswerCorrect}>Rendben</button>
					<button
						type='button'
						onClick={onShowAnswer}
						disabled={$answerShown}
					>
						Mutasd a választ
					</button>
				</ButtonRowComp>
			</ContentRowComp>
		</form>
	)
}
