import { Word } from '../model/Word'
import { translationToString } from './translationToString'

export function wordToString(word: Word): string {
	return `${translationToString(word.translation0)} = ${translationToString(
		word.translation1,
	)}`
}
