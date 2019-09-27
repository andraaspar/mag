import { Dictionary } from '../model/Dictionary'
import { sanitizeString } from './sanitizeString'

export function sanitizeDictionary(d: Dictionary): Dictionary {
	return {
		name: sanitizeString(d.name),
		languages: d.languages.map(sanitizeString) as [string, string],
	}
}
