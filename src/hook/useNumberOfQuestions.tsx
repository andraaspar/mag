import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { TLoadable } from '../model/TLoadable'
import { countNumberOfQuestions } from '../storage/countNumberOfQuestions'

export function useNumberOfQuestions(dictionaryId: number | null) {
	const [$numberOfQuestions, set$numberOfQuestions] = useState<
		TLoadable<{ current: number }>
	>(null)
	const loadNumberOfQuestions = useCallback(() => {
		if (dictionaryId == null) {
			set$numberOfQuestions(0)
		} else {
			let aborted = false
			set$numberOfQuestions(Date.now())
			countNumberOfQuestions({ dictionaryId })
				.then(count => {
					if (aborted) return
					set$numberOfQuestions({ current: count })
				})
				.catch(e => {
					if (aborted) return
					set$numberOfQuestions(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [dictionaryId])
	return { $numberOfQuestions, set$numberOfQuestions, loadNumberOfQuestions }
}
