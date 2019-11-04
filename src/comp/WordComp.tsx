import React from 'react'
import { Link } from 'react-router-dom'
import { Word } from '../model/Word'
import { TranslationComp } from './TranslationComp'

export interface WordCompProps {
	_word: Word
	_swapTranslations?: boolean
}

export function WordComp({ _word, _swapTranslations }: WordCompProps) {
	return (
		<>
			<Link to={`/dictionary/${_word.dictionaryId}/word/${_word.id}/`}>
				<TranslationComp
					_translation={
						_swapTranslations
							? _word.translation1
							: _word.translation0
					}
				/>
				{` = `}
				<TranslationComp
					_translation={
						_swapTranslations
							? _word.translation0
							: _word.translation1
					}
				/>
			</Link>
		</>
	)
}
