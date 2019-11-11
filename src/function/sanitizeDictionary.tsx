import { Dictionary } from '../model/Dictionary'
import { sanitizeString } from './sanitizeString'

export function sanitizeDictionary(d: Dictionary): Dictionary {
	return {
		...(d.id != null && { id: d.id }),
		name: sanitizeString(d.name),
		language0: sanitizeString(d.language0),
		language1: sanitizeString(d.language1),
		count: d.count,
	}
}
