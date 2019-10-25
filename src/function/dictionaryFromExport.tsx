import { Dictionary, ExportedDictionary } from '../model/Dictionary'

export function dictionaryFromExport(d: ExportedDictionary): Dictionary {
	console.log(`[pzxh0n]`, d)
	return {
		languages: d.languages,
		name: d.name,
	}
}
