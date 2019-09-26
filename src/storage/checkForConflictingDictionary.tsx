import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, INDEX_DICTIONARIES_NAME, STORE_DICTIONARIES } from './Db'

export class DictionaryNameConflictError extends Error {
	constructor(public dictionary: Dictionary) {
		super('[pyeant] Szótár név ütközés.')
	}
}

export async function checkForConflictingDictionary({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	dictionary,
}: {
	t?: IDBPTransaction<Db>
	dictionary: Dictionary
}) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	const dictionaryWithSameName = await dictionariesStore
		.index(INDEX_DICTIONARIES_NAME)
		.get(dictionary.name)
	if (dictionaryWithSameName && dictionaryWithSameName.id !== dictionary.id) {
		throw new DictionaryNameConflictError(dictionary)
	}
}
