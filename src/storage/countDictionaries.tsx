import { IDBPTransaction } from 'idb'
import { DbDictionary } from '../model/Dictionary'
import { countItems } from './countItems'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function countDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	filter,
}: {
	t?: IDBPTransaction<Db>
	filter?: (v: DbDictionary) => boolean
}) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	return countItems({
		source: dictionariesStore,
		filter,
	})
}
