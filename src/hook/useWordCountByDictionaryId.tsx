import { useContext, useState } from 'react'
import { useCallback } from 'use-memo-one'
import { ShowMessageContext } from '../comp/ShowMessageContext'
import { TLoadable } from '../model/TLoadable'
import { DbWord } from '../model/Word'
import { countWordsByDictionaryId } from '../storage/countWordsByDictionaryId'

export function useWordCountByDictionaryId({
	dictionaryId,
	filter,
}: {
	dictionaryId: number | null
	filter?: (word: DbWord) => boolean
}) {
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
			countWordsByDictionaryId({ dictionaryId, filter })
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
	}, [dictionaryId, filter, showMessage])
	return { $wordCount, set$wordCount, loadWordCount }
}
