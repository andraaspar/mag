import { ExportedWord, Word } from '../model/Word'

export function wordFromExport(w: ExportedWord): Word {
	return {
		dictionaryId: -1,
		modifiedDate: w.modifiedDate,
		translation0: w.translation0,
		translation1: w.translation1,
	}
}
