import { Dictionary, DictionaryFromAndroid } from '../model/Dictionary'

export function dictionaryFromAndroid(
	dictionaryFromAndroid: DictionaryFromAndroid,
): Dictionary {
	return {
		name: dictionaryFromAndroid.name,
		languages: [
			dictionaryFromAndroid.firstLanguageName,
			dictionaryFromAndroid.secondLanguageName,
		],
	}
}
