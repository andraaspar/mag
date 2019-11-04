import { useMemo } from 'use-memo-one'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import { useExistingTranslationError } from './useExistingTranslationError'

export function useWordValidationErrors(word: Word | null) {
	const existingTranslationError = useExistingTranslationError(word)
	const result: TLoadable<Error[]> = useMemo(() => {
		return !isLoaded(existingTranslationError)
			? existingTranslationError
			: ([
					existingTranslationError.current,
					word &&
						(!word.translation0.text.trim() ||
							!word.translation1.text.trim()) &&
						new Error(`Mindkét fordítás megadása kötelező.`),
			  ].filter(Boolean) as Error[])
	}, [existingTranslationError, word])
	return result
}
