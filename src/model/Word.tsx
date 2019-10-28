import { stringToIdbSortable } from '../function/stringToIdbSortable'
import {
	DbTranslation,
	Translation,
	translationFromDb,
	translationToDb,
} from './Translation'

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
	countForSort: number
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

export function wordToDb(w: Word): DbWord {
	const translation0 = translationToDb(w.translation0)
	const translation1 = translationToDb(w.translation1)
	return {
		...(w.id && { id: w.id }),
		dictionaryId: w.dictionaryId,
		translation0,
		translation1,
		modifiedDate: w.modifiedDate,
		modifiedDateForSort: stringToIdbSortable(w.modifiedDate, {
			reverse: true,
		}),
		countForSort:
			translation0.countForSort === 0 || translation1.countForSort === 0
				? 0
				: 1,
	}
}

export function wordFromDb(w: DbWord): Word {
	return {
		id: w.id,
		dictionaryId: w.dictionaryId,
		translation0: translationFromDb(w.translation0),
		translation1: translationFromDb(w.translation1),
		modifiedDate: w.modifiedDate,
	}
}
