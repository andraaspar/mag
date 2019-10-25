import { useCallback, useContext, useState } from 'react'
import { ShowMessageContext } from '../comp/ShowMessageContext'
import { TLoadable } from '../model/TLoadable'
import { countWordsByDictionaryId } from '../storage/countWordsByDictionaryId'

export function useWordCountByDictionaryId(dictionaryId: number | null) {
	const [$wordCount, set$wordCount] = useState<
		TLoadable<{ current: number }>
	>(null)
	const showMessage = useContext(ShowMessageContext)
	const loadWordCount = useCallback(() => {
		if (dictionaryId == null) {
			set$wordCount({ current: 0 })
		} else {
			let aborted = false
			set$wordCount(Date.now())
			countWordsByDictionaryId({ dictionaryId })
				.then(count => {
					if (aborted) return
					set$wordCount({ current: count })
				})
				.catch(e => {
					if (aborted) return
					showMessage(e)
					set$wordCount(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [dictionaryId, showMessage])
	return { $wordCount, set$wordCount, loadWordCount }
}
