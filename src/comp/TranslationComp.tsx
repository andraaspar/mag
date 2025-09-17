import { QUESTIONS_CHARACTER } from '../model/constants'
import { Translation } from '../model/Translation'

export interface TranslationCompProps {
	_translation: Translation
}

export function TranslationComp({ _translation }: TranslationCompProps) {
	return (
		<>
			{_translation.count > 0 && `${QUESTIONS_CHARACTER} `}
			{_translation.category && <i>{_translation.category}</i>}{' '}
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
