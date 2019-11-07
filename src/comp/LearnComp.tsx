import React, { FormEvent, useRef, useState } from 'react'
import { sanitizeString } from '../function/sanitizeString'
import { Dictionary } from '../model/Dictionary'
import { Word } from '../model/Word'
import { storeWord } from '../storage/storeWord'

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

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		const newCount = Math.min(3, question.count + ($answerShown ? 1 : -1))
		await storeWord({
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
			<p>
				{questionLanguage}: {question.text}
			</p>
			{question.description && <p>Megjegyzés: {question.description}</p>}
			<p>
				{answerLanguage}:{' '}
				<input
					ref={inputRef}
					autoFocus
					value={$answer}
					onChange={e => {
						set$answer(e.target.value)
					}}
				/>
			</p>
			<p>
				<button disabled={!isAnswerCorrect}>Rendben</button> •{' '}
				<button
					type='button'
					onClick={onShowAnswer}
					disabled={$answerShown}
				>
					Mutasd a választ
				</button>
			</p>
		</form>
	)
}
