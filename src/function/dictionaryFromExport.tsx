import { Dictionary, ExportedDictionary } from '../model/Dictionary'

export function dictionaryFromExport(d: ExportedDictionary): Dictionary {
	return {
		name: d.name,
		language0: d.language0,
		language1: d.language1,
		count: 0,
		categories0: d.categories0,
		categories1: d.categories1,
	}
}
