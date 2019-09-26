import { IDBPTransaction } from 'idb'
import { isNumber } from 'util'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, INDEX_DICTIONARIES_NAME, STORE_DICTIONARIES } from './Db'

export async function readDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	pageSize,
	page = 0,
}: {
	t?: IDBPTransaction<Db>
	pageSize?: number
	page?: number
}) {
	const nameIndex = t
		.objectStore(STORE_DICTIONARIES)
		.index(INDEX_DICTIONARIES_NAME)
	if (isNumber(pageSize)) {
		const result: Dictionary[] = []
		let cursor = await nameIndex.openCursor()
		if (cursor && page > 0) {
			const firstItemIndex = page * pageSize
			cursor = await cursor.advance(firstItemIndex)
		}
		while (cursor && result.length < pageSize) {
			result.push(cursor.value)
			cursor = await cursor.continue()
		}
		return result
	} else {
		return nameIndex.getAll()
	}
}
