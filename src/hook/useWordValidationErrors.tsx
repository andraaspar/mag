import { useMemo } from 'use-memo-one'
import { simplifyConflictingWords } from '../function/simplifyConflictingWords'
import { wordToString } from '../function/wordToString'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import { useConflictingWord } from './useConflictingWord'

export function useWordValidationErrors(word: Word | null) {
	const conflictingWord = useConflictingWord(word)
	const result: TLoadable<string[]> = useMemo(() => {
		return !isLoaded(conflictingWord)
			? conflictingWord
			: ([
					conflictingWord.current &&
						`Már létező fordítás: ${simplifyConflictingWords(
							conflictingWord.current,
						)
							.map(t => wordToString(t!))
							.join('; ')}`,
					word &&
						(!word.translation0.text.trim() ||
							!word.translation1.text.trim()) &&
						`Mindkét fordítás megadása kötelező.`,
			  ].filter(Boolean) as string[])
	}, [conflictingWord, word])
	return result
}
