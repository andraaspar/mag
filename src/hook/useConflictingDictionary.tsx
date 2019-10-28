import { useEffect, useState } from 'react'
import { Dictionary } from '../model/Dictionary'
import { TLoadable } from '../model/TLoadable'
import {
	checkForConflictingDictionary,
	DictionaryNameConflictError,
} from '../storage/checkForConflictingDictionary'

export function useConflictingDictionary(dictionary: Dictionary | null) {
	const [$conflictingDictionary, set$conflictingDictionary] = useState<
		TLoadable<{ exists: boolean }>
	>(null)
	useEffect(() => {
		let isAborted = false
		;(async () => {
			try {
				if (dictionary) {
					set$conflictingDictionary(Date.now())
					await checkForConflictingDictionary({ dictionary })
					if (isAborted) return
				}
				set$conflictingDictionary({ exists: false })
			} catch (e) {
				if (isAborted) return
				if (e instanceof DictionaryNameConflictError) {
					set$conflictingDictionary({
						exists: true,
					})
				} else {
					console.error(e)
					set$conflictingDictionary(e + '')
				}
			}
		})()
		return () => {
			isAborted = true
		}
	}, [dictionary])
	return $conflictingDictionary
}
