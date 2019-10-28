import { Word } from '../model/Word'

export function simplifyConflictingWords(
	w: [Word | undefined, Word | undefined],
): Word[] {
	return w[0] && w[1] && w[0].id === w[1].id
		? [w[0]]
		: (w.filter(Boolean) as Word[])
}
