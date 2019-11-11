import { Dictionary, DictionaryFromAndroid } from '../model/Dictionary'

export function dictionaryFromAndroid(
	dictionaryFromAndroid: DictionaryFromAndroid,
): Dictionary {
	return {
		name: dictionaryFromAndroid.name,
		language0: dictionaryFromAndroid.firstLanguageName,
		language1: dictionaryFromAndroid.secondLanguageName,
		count: 0,
	}
}
