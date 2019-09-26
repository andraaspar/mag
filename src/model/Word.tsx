import { Translation } from './Translation'

export interface Word {
	id?: number
	dictionaryId: number
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
