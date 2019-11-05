import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { avoidDuplicates } from '../function/avoidDuplicates'
import { shuffle } from '../function/shuffle'
import { Question } from '../model/Question'
import { TLoadable } from '../model/TLoadable'
import { readQuestions } from '../storage/readQuestions'

export function useQuestions({
	dictionaryId,
	wordIdNotFirst,
}: {
	dictionaryId: number | null
	wordIdNotFirst: React.MutableRefObject<number | null>
}) {
	const [$questions, set$questions] = useState<
		TLoadable<{ current: readonly Question[] | undefined }>
	>(null)
	const loadQuestions = useCallback(() => {
		let aborted = false
		if (dictionaryId == null) {
			set$questions({ current: undefined })
		} else {
			set$questions(Date.now())
			readQuestions({
				dictionaryId,
			})
				.then(questions => {
					if (aborted) return
					questions = shuffle(questions)
					questions = avoidDuplicates(
						questions,
						(a, b) => a.wordId === b.wordId,
					)
					if (
						wordIdNotFirst.current != null &&
						questions[0] &&
						questions[0].wordId === wordIdNotFirst.current
					) {
						questions.push(questions.shift()!)
					}
					set$questions({ current: questions })
				})
				.catch(e => {
					if (aborted) return
					console.error(e)
					set$questions(e + '')
				})
		}
		return () => {
			aborted = true
		}
	}, [dictionaryId, wordIdNotFirst])
	return { $questions, set$questions, loadQuestions }
}
