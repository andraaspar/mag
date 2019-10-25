import { useMemo } from 'react'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { useConflictingDictionary } from './useConflictingDictionary'

export function useDictionaryValidationErrors(
	dictionary: Dictionary | null,
): TLoadable<string[]> {
	const conflictingDictionary = useConflictingDictionary(dictionary)
	const result: TLoadable<string[]> = useMemo(() => {
		return !isLoaded(conflictingDictionary)
			? conflictingDictionary
			: ([
					conflictingDictionary.exists &&
						`Ezzel a névvel már létezik egy szótár.`,
					dictionary &&
						!dictionary.name.trim() &&
						`A név megadása kötelező.`,
					dictionary &&
						(!dictionary.language0.trim() ||
							!dictionary.language1.trim()) &&
						`Mindkét nyelvet el kell nevezned.`,
					dictionary &&
						dictionary.language0 &&
						dictionary.language0 === dictionary.language1 &&
						`A két nyelv neve nem lehet ugyanaz.`,
			  ].filter(Boolean) as string[])
	}, [conflictingDictionary, dictionary])
	return result
}
