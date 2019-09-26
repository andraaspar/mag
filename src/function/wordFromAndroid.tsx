import { DEFAULT_COUNT } from '../model/constants'
import { Word, WordFromAndroid } from '../model/Word'
import { dateToString } from './dateToString'

export function wordFromAndroid(wordFromAndroid: WordFromAndroid): Word {
	return {
		dictionaryId: -1,
		modifiedDate: dateToString(new Date()),
		translation0: {
			text: wordFromAndroid.inFirstLanguage,
			description: wordFromAndroid.firstLanguageComment,
			count: DEFAULT_COUNT,
		},
		translation1: {
			text: wordFromAndroid.inSecondLanguage,
			description: wordFromAndroid.secondLanguageComment,
			count: DEFAULT_COUNT,
		},
	}
}
