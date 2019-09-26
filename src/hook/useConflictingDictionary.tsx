import { useContext, useEffect, useState } from 'react'
import { ShowMessageContext } from '../comp/ShowMessageContext'
import { Dictionary } from '../model/Dictionary'
import { TLoadable } from '../model/TLoadable'
import {
	checkForConflictingDictionary,
	DictionaryNameConflictError,
} from '../storage/checkForConflictingDictionary'

export function useConflictingDictionary(dictionary: Dictionary) {
	const [$conflictingDictionary, set$conflictingDictionary] = useState<
		TLoadable<{ exists: boolean }>
	>(null)
	const showMessage = useContext(ShowMessageContext)
	useEffect(() => {
		let isAborted = false
		;(async () => {
			try {
				set$conflictingDictionary(Date.now())
				await checkForConflictingDictionary({ dictionary })
				if (isAborted) return
				set$conflictingDictionary({ exists: false })
			} catch (e) {
				if (isAborted) return
				if (e instanceof DictionaryNameConflictError) {
					set$conflictingDictionary({
						exists: true,
					})
				} else {
					showMessage(e)
					set$conflictingDictionary(e + '')
				}
			}
		})()
		return () => {
			isAborted = true
		}
	}, [dictionary, showMessage])
	return $conflictingDictionary
}
