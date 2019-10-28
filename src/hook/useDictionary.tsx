import { useCallback, useState } from 'react'
import { Dictionary } from '../model/Dictionary'
import { TLoadable } from '../model/TLoadable'
import { readDictionaryById } from '../storage/readDictionaryById'

export function useDictionary(dictionaryId: number | null) {
	const [$dictionary, set$dictionary] = useState<
		TLoadable<{ current: Dictionary | undefined }>
	>(null)
	const loadDictionary = useCallback(() => {
		if (dictionaryId == null) {
			set$dictionary({ current: undefined })
		} else {
			let aborted = false
			set$dictionary(Date.now())
			readDictionaryById({ id: dictionaryId })
				.then(dictionary => {
					if (aborted) return
					set$dictionary({ current: dictionary })
				})
				.catch(e => {
					console.error(e)
					set$dictionary(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [dictionaryId])
	return {
		$dictionary,
		set$dictionary,
		loadDictionary,
	}
}
