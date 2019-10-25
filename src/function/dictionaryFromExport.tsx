import { Dictionary, ExportedDictionary } from '../model/Dictionary'

export function dictionaryFromExport(d: ExportedDictionary): Dictionary {
	return {
		languages: d.languages,
		name: d.name,
	}
}
