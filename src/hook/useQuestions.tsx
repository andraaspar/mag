import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { shuffle } from '../function/shuffle'
import { Question } from '../model/Question'
import { TLoadable } from '../model/TLoadable'
import { readQuestions } from '../storage/readQuestions'

export function useQuestions(dictionaryId: number | null) {
	const [$questions, set$questions] = useState<
		TLoadable<{ current: readonly Question[] | undefined }>
	>(null)
	const loadQuestions = useCallback(() => {
		if (dictionaryId == null) {
			set$questions({ current: undefined })
		} else {
			set$questions(Date.now())
			readQuestions({
				dictionaryId,
			})
				.then(questions => {
					set$questions({ current: shuffle(questions) })
				})
				.catch(e => {
					console.error(e)
					set$questions(e + '')
				})
		}
	}, [dictionaryId])
	return { $questions, set$questions, loadQuestions }
}
