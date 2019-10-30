import { useCallback, useContext, useState } from 'react'
import { ShowMessageContext } from '../comp/ShowMessageContext'
import { TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import {
	readWordsByDictionaryId,
	WordsByDictionaryIdSort,
} from '../storage/readWordsByDictionaryId'

export function useWordsByDictionaryId({
	dictionaryId,
	page,
	pageSize,
	sort,
}: {
	dictionaryId: number | null
	page?: number
	pageSize?: number
	sort?: WordsByDictionaryIdSort
}) {
	const showMessage = useContext(ShowMessageContext)
	const [$words, set$words] = useState<
		TLoadable<{ current: readonly Word[] | undefined }>
	>(null)
	const loadWords = useCallback(() => {
		if (dictionaryId == null) {
			set$words({ current: undefined })
		} else {
			let aborted = false
			set$words(Date.now())
			readWordsByDictionaryId({
				dictionaryId,
				page,
				pageSize,
				sort,
			})
				.then(words => {
					if (aborted) return
					set$words({ current: words })
				})
				.catch(e => {
					if (aborted) return
					showMessage(e)
					set$words(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [dictionaryId, showMessage, page, pageSize, sort])
	return { $words, set$words, loadWords }
}
