import React, { useEffect, useState } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import { sanitizeString } from '../function/sanitizeString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useQuestions } from '../hook/useQuestions'
import { useWord } from '../hook/useWord'
import { isLoaded } from '../model/TLoadable'
import { storeWord } from '../storage/storeWord'
import { LoadableComp } from './LoadableComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface LearnPageProps {}

export function LearnPage(props: LearnPageProps) {
	const routeMatch = useRouteMatch<{ dictionaryId: string }>(
		'/dictionary/:dictionaryId/learn/',
	)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId, 10)
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const { $questions, loadQuestions } = useQuestions(dictionaryId)
	const [$questionsCount, set$questionsCount] = useState(0)
	const [$questionsLearnedCount, set$questionsLearnedCount] = useState(0)
	const progress =
		$questionsCount > 0 ? $questionsLearnedCount / $questionsCount : 0
	useEffect(() => {
		if (
			isLoaded($questions) &&
			$questions.current &&
			$questions.current.length > $questionsCount
		) {
			set$questionsCount($questions.current.length)
		}
	}, [$questions, $questionsCount])
	const [$questionIndex, set$questionIndex] = useState(0)
	const { $word, loadWord } = useWord(
		isLoaded($questions) &&
			$questions.current &&
			$questions.current[$questionIndex]
			? $questions.current[$questionIndex].wordId
			: null,
	)
	const [$answer, set$answer] = useState('')
	const translationId =
		isLoaded($questions) &&
		$questions.current &&
		$questions.current[$questionIndex]
			? $questions.current[$questionIndex].translationId
			: 0
	const correctAnswer = (() => {
		if (isLoaded($word) && $word.current) {
			return translationId === 0
				? $word.current.translation1.text
				: $word.current.translation0.text
		}
		return null
	})()
	const isAnswerCorrect = sanitizeString($answer) === correctAnswer
	const [$answerShown, set$answerShown] = useState(false)
	const dictionary =
		isLoaded($dictionary) && $dictionary.current
			? $dictionary.current
			: undefined
	const word = isLoaded($word) && $word.current ? $word.current : undefined
	const questionLanguage =
		dictionary == null
			? null
			: translationId === 0
			? dictionary.language0
			: dictionary.language1
	const answerLanguage =
		dictionary == null
			? null
			: translationId === 0
			? dictionary.language1
			: dictionary.language0
	const question =
		word == null
			? null
			: translationId === 0
			? word.translation0
			: word.translation1
	async function onOk() {
		if (
			!isLoaded($questions) ||
			$questions.current == null ||
			!isLoaded($word) ||
			$word.current == null
		)
			return
		const w = $word.current
		const newCount = Math.min(
			3,
			(translationId === 0
				? w.translation0.count
				: w.translation1.count) + ($answerShown ? 1 : -1),
		)
		await storeWord({
			word: {
				...w,
				...(translationId === 0
					? {
							translation0: {
								...w.translation0,
								count: newCount,
							},
					  }
					: {
							translation1: {
								...w.translation1,
								count: newCount,
							},
					  }),
			},
		})
		if (newCount === 0) {
			set$questionsLearnedCount($questionsLearnedCount + 1)
		}
		set$answerShown(false)
		set$answer('')
		if ($questionIndex + 1 === $questions.current.length) {
			loadQuestions()
			set$questionIndex(0)
		} else {
			set$questionIndex($questionIndex + 1)
		}
	}
	function onShowAnswer() {
		if (correctAnswer == null) return
		set$answerShown(true)
		set$answer(correctAnswer)
	}
	usePageTitle(`Tanulás`)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<>
						<h1>Tanulás</h1>
						<LoadableComp _value={$questions} _load={loadQuestions}>
							{questions => (
								<>
									{questions.current == null ||
									questions.current.length === 0 ? (
										<Redirect to={`../`} />
									) : (
										<>
											<p>
												<progress value={progress}>
													{Math.round(progress * 100)}
													%
												</progress>
											</p>
											<LoadableComp
												_value={$word}
												_load={loadWord}
											>
												{word =>
													question == null ? (
														<></>
													) : (
														<>
															<p>
																{
																	questionLanguage
																}
																:{' '}
																{question.text}
															</p>
															{question.description && (
																<p>
																	Megjegyzés:{' '}
																	{
																		question.description
																	}
																</p>
															)}
															<p>
																{answerLanguage}
																:{' '}
																<input
																	value={
																		$answer
																	}
																	onChange={e => {
																		set$answer(
																			e
																				.target
																				.value,
																		)
																	}}
																/>
															</p>
															<p>
																<button
																	type='button'
																	onClick={
																		onOk
																	}
																	disabled={
																		!isAnswerCorrect
																	}
																>
																	Rendben
																</button>{' '}
																•{' '}
																<button
																	type='button'
																	onClick={
																		onShowAnswer
																	}
																	disabled={
																		$answerShown
																	}
																>
																	Mutasd a
																	választ
																</button>
															</p>
														</>
													)
												}
											</LoadableComp>
										</>
									)}
								</>
							)}
						</LoadableComp>
					</>
				)
			}
		</LoadableComp>
	)
}
