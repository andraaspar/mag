import { useEffect, useState } from 'react'
import { TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import {
	checkForConflictingWord,
	ExistingTranslationError,
} from '../storage/checkForConflictingWord'

export function useExistingTranslationError(word: Word | null) {
	const [$conflictingTranslations, set$conflictingTranslations] = useState<
		TLoadable<{ current: ExistingTranslationError | undefined }>
	>(null)
	useEffect(() => {
		let isAborted = false
		;(async () => {
			try {
				if (word) {
					set$conflictingTranslations(Date.now())
					await checkForConflictingWord({ word })
					if (isAborted) return
				}
				set$conflictingTranslations({ current: undefined })
			} catch (e) {
				if (isAborted) return
				if (e instanceof ExistingTranslationError) {
					set$conflictingTranslations({ current: e })
				} else {
					console.error(e)
					set$conflictingTranslations(e + '')
				}
			}
		})()
		return () => {
			isAborted = true
		}
	}, [word])
	return $conflictingTranslations
}
