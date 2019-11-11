import React, { useEffect, useRef, useState } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import { useCallback } from 'use-memo-one'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useQuestions } from '../hook/useQuestions'
import { useWord } from '../hook/useWord'
import { isLoaded } from '../model/TLoadable'
import { ContentRowComp } from './ContentRowComp'
import { FormRowComp } from './FormRowComp'
import { LearnComp } from './LearnComp'
import { LoadableComp } from './LoadableComp'
import { ProgressComp } from './ProgressComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface LearnPageProps {}

export function LearnPage(props: LearnPageProps) {
	const routeMatch = useRouteMatch<{ dictionaryId: string }>(
		'/dictionary/:dictionaryId/learn/',
	)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId, 10)
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const lastWordId = useRef<number | null>(null)
	const { $questions, set$questions, loadQuestions } = useQuestions({
		dictionaryId,
		wordIdNotFirst: lastWordId,
	})
	const [$questionsCount, set$questionsCount] = useState(0)
	const [$questionsLearnedCount, set$questionsLearnedCount] = useState(0)
	const progress =
		$questionsCount > 0
			? $questionsLearnedCount / Math.max(1, $questionsCount - 1)
			: 0
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
	const { $word, set$word, loadWord } = useWord(
		isLoaded($questions) &&
			$questions.current &&
			$questions.current[$questionIndex]
			? $questions.current[$questionIndex].wordId
			: null,
	)
	const translationId =
		isLoaded($questions) &&
		$questions.current &&
		$questions.current[$questionIndex]
			? $questions.current[$questionIndex].translationId
			: 0

	const word = isLoaded($word) && $word.current ? $word.current : undefined
	if (word) {
		lastWordId.current = word.id!
	}

	const next = useCallback(
		({ success }: { success: boolean }) => {
			if (!isLoaded($questions) || $questions.current == null)
				throw new Error(`[q0lv6a]`)
			if (success) {
				set$questionsLearnedCount($questionsLearnedCount + 1)
			}
			if ($questionIndex + 1 === $questions.current.length) {
				set$questionIndex(0)
				set$questions(null)
			} else {
				set$questionIndex($questionIndex + 1)
				set$word(null) // Force refresh word even if it has the same ID
			}
		},
		[
			$questions,
			$questionIndex,
			set$questionIndex,
			set$word,
			$questionsLearnedCount,
			set$questions,
		],
	)

	usePageTitle(`Tanulás`)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<ContentRowComp>
						<h1>Tanulás</h1>
						<LoadableComp _value={$questions} _load={loadQuestions}>
							{questions =>
								questions.current == null ||
								questions.current.length === 0 ? (
									<Redirect to={`../`} />
								) : (
									<>
										<FormRowComp>
											<ProgressComp
												_progress={progress}
											/>
										</FormRowComp>
										<LoadableComp
											_value={$word}
											_load={loadWord}
										>
											{word =>
												word.current == null ? (
													<></>
												) : (
													<LearnComp
														_dictionary={
															dictionary.current!
														}
														_word={word.current}
														_translationId={
															translationId
														}
														_next={next}
													/>
												)
											}
										</LoadableComp>
									</>
								)
							}
						</LoadableComp>
					</ContentRowComp>
				)
			}
		</LoadableComp>
	)
}
