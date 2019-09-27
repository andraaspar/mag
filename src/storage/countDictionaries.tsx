import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function countDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	filter,
}: {
	t?: IDBPTransaction<Db>
	filter?: (v: Dictionary) => boolean
}) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	if (filter) {
		let result = 0
		let cursor = await dictionariesStore.openCursor()
		while (cursor) {
			if (filter(cursor.value)) result++
			cursor = await cursor.continue()
		}
		return result
	} else {
		return dictionariesStore.count()
	}
}
