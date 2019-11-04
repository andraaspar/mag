import React, { Fragment } from 'react'
import { useMemo } from 'use-memo-one'
import { TSelection } from '../model/TSelection'
import { Word } from '../model/Word'
import { WordListComp } from './WordListComp'

interface WordListByDate {
	date: string
	firstIndex: number
	words: Word[]
}

export interface WordListByDateCompProps {
	_words: readonly Word[]
	_firstIndex: number
	_selectedWordIds: TSelection
	_setSelectedWordIds: (v: TSelection) => void
	_swapTranslations: boolean
}

export function WordListByDateComp({
	_words,
	_firstIndex,
	_selectedWordIds,
	_setSelectedWordIds,
	_swapTranslations,
}: WordListByDateCompProps) {
	const wordsByDate = useMemo(
		() =>
			_words.reduce<WordListByDate[]>((all, word) => {
				const lastList = all[all.length - 1]
				if (!lastList || lastList.date !== word.modifiedDate) {
					all.push({
						date: word.modifiedDate,
						firstIndex: lastList
							? lastList.firstIndex + lastList.words.length
							: _firstIndex,
						words: [word],
					})
				} else {
					lastList.words.push(word)
				}
				return all
			}, []),
		[_words, _firstIndex],
	)
	return (
		<>
			{wordsByDate.map((list, i) => (
				<Fragment key={list.date}>
					<p>
						<small>{list.date}</small>
					</p>
					<WordListComp
						_firstIndex={list.firstIndex}
						_words={list.words}
						_selectedWordIds={_selectedWordIds}
						_setSelectedWordIds={_setSelectedWordIds}
						_swapTranslations={_swapTranslations}
					/>
				</Fragment>
			))}
		</>
	)
}
