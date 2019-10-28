import { useEffect, useState } from 'react'
import { TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import {
	checkForConflictingWord,
	ExistingTranslationError,
} from '../storage/checkForConflictingWord'

export function useConflictingWord(word: Word | null) {
	const [$conflictingTranslations, set$conflictingTranslations] = useState<
		TLoadable<{ current: [Word | undefined, Word | undefined] | undefined }>
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
					set$conflictingTranslations({
						current: e.translations,
					})
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
