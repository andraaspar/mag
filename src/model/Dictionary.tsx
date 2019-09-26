import { Word1, WordFromAndroid } from './Word'

export interface Dictionary {
	id?: number
	name: string
	languages: [string, string]
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
