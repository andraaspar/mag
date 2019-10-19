import { IDBPTransaction } from 'idb'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export function readDictionaryById({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	id,
}: {
	t?: IDBPTransaction<Db>
	id: number
}) {
	return t.objectStore(STORE_DICTIONARIES).get(id)
}
