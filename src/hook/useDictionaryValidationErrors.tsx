import { useMemo } from 'react'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { useConflictingDictionary } from './useConflictingDictionary'

export function useDictionaryValidationErrors(
	dictionary: Dictionary | null,
): TLoadable<Error[]> {
	const conflictingDictionary = useConflictingDictionary(dictionary)
	const result: TLoadable<Error[]> = useMemo(() => {
		return !isLoaded(conflictingDictionary)
			? conflictingDictionary
			: ([
					conflictingDictionary.exists &&
						new Error(`Ezzel a névvel már létezik egy szótár.`),
					dictionary &&
						!dictionary.name.trim() &&
						new Error(`A név megadása kötelező.`),
					dictionary &&
						(!dictionary.language0.trim() || !dictionary.language1.trim()) &&
						new Error(`Mindkét nyelvet el kell nevezned.`),
					dictionary &&
						dictionary.language0 &&
						dictionary.language0 === dictionary.language1 &&
						new Error(`A két nyelv neve nem lehet ugyanaz.`),
					dictionary &&
						dictionary.categories0?.find((it) => !it.trim()) &&
						new Error(`Üres kategória név nem megengedett.`),
					dictionary &&
						dictionary.categories1?.find((it) => !it.trim()) &&
						new Error(`Üres kategória név nem megengedett.`),
			  ].filter(Boolean) as Error[])
	}, [conflictingDictionary, dictionary])
	return result
}
