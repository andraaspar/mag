import { stringToIdbSortable } from '../function/stringToIdbSortable'
import { ExportedWord, Word1, WordFromAndroid } from './Word'

export interface Dictionary {
	id?: number
	name: string
	language0: string
	language1: string
}

export interface ExportedDictionary {
	version: 1
	name: string
	language0: string
	language1: string
	words: readonly ExportedWord[]
}

export interface DbDictionary extends Dictionary {
	nameForSort: string
	language0ForSort: string
	language1ForSort: string
}

export function makeDbDictionary(o: Dictionary): DbDictionary {
	return {
		...o,
		nameForSort: stringToIdbSortable(o.name),
		language0ForSort: stringToIdbSortable(o.language0),
		language1ForSort: stringToIdbSortable(o.language1),
	}
}

export interface Dictionary1 {
	id?: number
	name: string
	lang1Name: string
	lang2Name: string
	words: Word1[]
}

export interface DictionaryFromAndroid {
	name: string
	firstLanguageName: string
	secondLanguageName: string
	words: WordFromAndroid[]
}
