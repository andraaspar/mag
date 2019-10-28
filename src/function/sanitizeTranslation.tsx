import { Translation } from '../model/Translation'
import { sanitizeString } from './sanitizeString'

export function sanitizeTranslation(t: Translation): Translation {
	return {
		count: t.count,
		text: sanitizeString(t.text),
		description: sanitizeString(t.description),
	}
}
