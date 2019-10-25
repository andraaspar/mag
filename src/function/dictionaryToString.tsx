import { Dictionary } from '../model/Dictionary'

export function dictionaryToString(dictionary: Dictionary): string {
	return `${dictionary.name} (${dictionary.language0}, ${dictionary.language1})`
}
