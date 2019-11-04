import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import { readWord } from '../storage/readWord'

export function useWord(wordId: number | null) {
	const [$word, set$word] = useState<
		TLoadable<{ current: Word | undefined }>
	>(null)
	const loadWord = useCallback(() => {
		if (wordId == null) {
			set$word({ current: undefined })
		} else {
			let aborted = false
			set$word(Date.now())
			readWord({ wordId })
				.then(word => {
					if (aborted) return
					set$word({ current: word })
				})
				.catch(e => {
					if (aborted) return
					console.error(e)
					set$word(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [wordId])
	return {
		$word,
		set$word,
		loadWord,
	}
}
