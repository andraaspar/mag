import { useMemo } from 'react'
import { isUndefined } from 'util'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { useConflictingDictionary } from './useConflictingDictionary'

export function useDictionaryValidationErrors(dictionary: Dictionary) {
	const conflictingDictionary = useConflictingDictionary(dictionary)
	const result: TLoadable<string[]> = useMemo(
		() =>
			!isLoaded(conflictingDictionary)
				? conflictingDictionary
				: ([
						conflictingDictionary.exists &&
							`Ezzel a névvel már létezik egy szótár.`,
						!dictionary.name.trim() && `A név megadása kötelező.`,
						!isUndefined(
							dictionary.languages.find(
								language => !language.trim(),
							),
						) && `Mindkét nyelvet el kell nevezned.`,
				  ].filter(Boolean) as string[]),
		[conflictingDictionary, dictionary],
	)
	return result
}
