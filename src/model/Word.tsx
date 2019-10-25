import { stringToIdbSortable } from '../function/stringToIdbSortable'
import { DbTranslation, makeDbTranslation, Translation } from './Translation'

export interface Word {
	id?: number
	dictionaryId: number
	translation0: Translation
	translation1: Translation
	modifiedDate: string
}

export interface DbWord {
	id?: number
	dictionaryId: number
	translation0: DbTranslation
	translation1: DbTranslation
	modifiedDate: string
	modifiedDateForSort: string
}

export function makeDbWord(w: Word): DbWord {
	return {
		...w,
		translation0: makeDbTranslation(w.translation0),
		translation1: makeDbTranslation(w.translation1),
		modifiedDateForSort: stringToIdbSortable(w.modifiedDate, {
			reverse: true,
		}),
	}
}

export interface ExportedWord {
	translation0: Translation
	translation1: Translation
	modifiedDate: string
}

export interface Word1 {
	lang1: string
	lang2: string
	lang1Count: number
	lang2Count: number
}

export interface WordFromAndroid {
	inFirstLanguage: string
	firstLanguageComment: string
	inSecondLanguage: string
	secondLanguageComment: string
}
