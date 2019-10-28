import { Word } from '../model/Word'
import { sanitizeTranslation } from './sanitizeTranslation'

export function sanitizeWord(w: Word): Word {
	return {
		...w,
		translation0: sanitizeTranslation(w.translation0),
		translation1: sanitizeTranslation(w.translation1),
	}
}
