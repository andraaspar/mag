import { IDBPTransaction } from 'idb'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function countDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
}: {
	t?: IDBPTransaction<Db>
}) {
	return t.objectStore(STORE_DICTIONARIES).count()
}
