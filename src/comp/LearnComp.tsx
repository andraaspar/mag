import { FormEvent, useContext, useRef, useState } from 'react'
import { sanitizeString } from '../function/sanitizeString'
import { Dictionary } from '../model/Dictionary'
import { Word } from '../model/Word'
import { getDb, STORE_DICTIONARIES, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { updateDictionaryCount } from '../storage/updateDictionaryCount'
import { RequiredComp } from './RequiredComp'
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
	const correctAnswer =
		_translationId === 0 ? _word.translation1 : _word.translation0
	const categories =
		_translationId === 0 ? _dictionary.categories1 : _dictionary.categories0
	const hasCategory =
		!!correctAnswer.category && !!categories && categories.length > 1
	const [$answer, set$answer] = useState('')
	const [$category, set$category] = useState('')
	const isAnswerCorrect = sanitizeString($answer) === correctAnswer.text
	const [$answerShown, set$answerShown] = useState(false)
	const [$categoryShown, set$categoryShown] = useState(false)
	const { showShield, hideShield } = useContext(ShieldContext)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		if (!canSubmit()) return
		const isCorrect =
			!$answerShown && (!hasCategory || $category === correctAnswer.category)
		const newCount = Math.min(3, question.count + (isCorrect ? -1 : 1))
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
		set$categoryShown(true)
		set$answer(correctAnswer.text)
		inputRef.current!.focus()
	}

	function canSubmit() {
		return isAnswerCorrect && (!hasCategory || $categoryShown)
	}

	return (
		<form onSubmit={onSubmit}>
			<div className='ccc_col ccc_gap_0_5'>
				<div>
					{questionLanguage}:{' '}
					<span className='ccc_large'>
						{question.category && <i>{question.category}</i>} {question.text}
					</span>
				</div>
				{question.description && <div>Megjegyzés: {question.description}</div>}
				<div className='ccc_para'>
					<label>
						{answerLanguage}
						<RequiredComp />:
					</label>
					<span className='ccc_para ccc_large ccc_flex_1_0_0'>
						{hasCategory &&
							!$categoryShown &&
							categories.map((category, index) => (
								<button
									autoFocus={index === 0}
									onClick={() => {
										set$category(category)
										if (category === correctAnswer.category)
											set$categoryShown(true)
										else onShowAnswer()
										inputRef.current?.focus()
									}}
								>
									{category}
								</button>
							))}
						{hasCategory && $categoryShown && (
							<i className='ccc_button_padding_y'>{correctAnswer.category}</i>
						)}
						<input
							ref={inputRef}
							autoFocus={!hasCategory || $categoryShown}
							value={$answer}
							onChange={(e) => {
								set$answer(e.target.value)
							}}
						/>
					</span>
				</div>
				<div className='ccc_para'>
					<button disabled={!canSubmit()}>Rendben</button>
					<button type='button' onClick={onShowAnswer} disabled={$answerShown}>
						Mutasd a választ
					</button>
				</div>
			</div>
		</form>
	)
}
