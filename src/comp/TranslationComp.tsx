import React from 'react'
import { Translation } from '../model/Translation'

export interface TranslationCompProps {
	_translation: Translation
}

export function TranslationComp({ _translation }: TranslationCompProps) {
	return (
		<>
			{_translation.count > 0 && '▶️ '}
			{_translation.text}
			{_translation.description && (
				<>
					{' ('}
					{_translation.description}
					{')'}
				</>
			)}
		</>
	)
}
