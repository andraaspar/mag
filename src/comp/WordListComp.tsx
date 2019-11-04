import React from 'react'
import { Link } from 'react-router-dom'
import { toggle } from '../function/toggle'
import { TSelection } from '../model/TSelection'
import { Word } from '../model/Word'
import { TranslationComp } from './TranslationComp'

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
					<Link to={`../word/${word.id}/`}>
						<TranslationComp
							_translation={
								_swapTranslations
									? word.translation1
									: word.translation0
							}
						/>
						{` = `}
						<TranslationComp
							_translation={
								_swapTranslations
									? word.translation0
									: word.translation1
							}
						/>
					</Link>
				</li>
			))}
		</ol>
	)
}
