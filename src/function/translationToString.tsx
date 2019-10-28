import { Translation } from '../model/Translation'

export function translationToString(t: Translation): string {
	return t.description ? `${t.text} (${t.description})` : t.text
}
