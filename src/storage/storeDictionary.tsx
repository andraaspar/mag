import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function storeDictionary({
	t = getDb().transaction([STORE_DICTIONARIES], 'readwrite'),
	dictionary,
}: {
	t?: IDBPTransaction<Db>
	dictionary: Dictionary
}) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	return await dictionariesStore.put(dictionary)
}
