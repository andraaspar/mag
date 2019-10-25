import { IDBPTransaction } from 'idb'
import { Dictionary, dictionaryToDb } from '../model/Dictionary'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function storeDictionary({
	t = getDb().transaction([STORE_DICTIONARIES], 'readwrite'),
	dictionary,
}: {
	t?: IDBPTransaction<Db>
	dictionary: Dictionary
}) {
	if (dictionary.id == null) delete dictionary.id
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	return dictionariesStore.put(dictionaryToDb(dictionary))
}
