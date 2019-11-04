import { useContext, useState } from 'react'
import { useCallback } from 'use-memo-one'
import { ShowMessageContext } from '../comp/ShowMessageContext'
import { TLoadable } from '../model/TLoadable'
import { DbWord, Word } from '../model/Word'
import {
	readWordsByDictionaryId,
	WordsByDictionaryIdSort,
} from '../storage/readWordsByDictionaryId'

export function useWordsByDictionaryId({
	dictionaryId,
	page,
	pageSize,
	sort,
	filter,
}: {
	dictionaryId: number | null
	page?: number
	pageSize?: number
	sort?: WordsByDictionaryIdSort
	filter?: (word: DbWord) => boolean
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
				filter,
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
	}, [dictionaryId, showMessage, page, pageSize, sort, filter])
	return { $words, set$words, loadWords }
}
