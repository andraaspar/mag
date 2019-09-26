import { Dictionary } from '../model/Dictionary'

export function dictionaryToString(dictionary: Dictionary): string {
	return `${dictionary.name} (${dictionary.languages.join(', ')})`
}
