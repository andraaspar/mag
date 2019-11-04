import React from 'react'
import { toggle } from '../function/toggle'
import { TSelection } from '../model/TSelection'
import { Word } from '../model/Word'
import { WordComp } from './WordComp'

export interface WordListCompProps {
	_firstIndex: number
	_words: readonly Word[]
	_selectedWordIds: TSelection
	_setSelectedWordIds: (v: TSelection) => void
	_swapTranslations: boolean
}

export function WordListComp({
	_firstIndex,
	_words,
	_selectedWordIds,
	_setSelectedWordIds,
	_swapTranslations,
}: WordListCompProps) {
	return (
		<ol start={_firstIndex + 1}>
			{_words.map(word => (
				<li key={word.id}>
					<input
						type='checkbox'
						checked={!!_selectedWordIds[word.id + '']}
						onChange={e => {
							_setSelectedWordIds(
								toggle(
									_selectedWordIds,
									word.id + '',
									e.target.checked,
								),
							)
						}}
					/>{' '}
					<WordComp
						_word={word}
						_swapTranslations={_swapTranslations}
					/>
				</li>
			))}
		</ol>
	)
}
