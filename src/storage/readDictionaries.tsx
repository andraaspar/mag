import { IDBPTransaction } from 'idb'
import { Db, getDb, INDEX_DICTIONARIES_NAME, STORE_DICTIONARIES } from './Db'

export async function readDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
}: {
	t?: IDBPTransaction<Db>
}) {
	return t
		.objectStore(STORE_DICTIONARIES)
		.index(INDEX_DICTIONARIES_NAME)
		.getAll()
}
