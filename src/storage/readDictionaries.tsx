import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, INDEX_DICTIONARIES_NAME, STORE_DICTIONARIES } from './Db'

export async function readDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	pageSize = Infinity,
	page = 0,
	filter,
}: {
	t?: IDBPTransaction<Db>
	pageSize?: number
	page?: number
	filter?: (d: Dictionary) => boolean
}) {
	const nameIndex = t
		.objectStore(STORE_DICTIONARIES)
		.index(INDEX_DICTIONARIES_NAME)
	if (!filter && !isFinite(pageSize)) {
		return nameIndex.getAll()
	}
	const result: Dictionary[] = []
	let cursor = await nameIndex.openCursor()
	const firstItemIndex = page * pageSize
	if (cursor) {
		if (firstItemIndex) {
			if (filter) {
				let index = -1
				while (cursor) {
					if (filter(cursor.value) && ++index === firstItemIndex) {
						break
					}
					cursor = await cursor.continue()
				}
			} else {
				cursor = await cursor.advance(firstItemIndex)
			}
		}
		while (cursor && result.length < pageSize) {
			if (!filter || filter(cursor.value)) {
				result.push(cursor.value)
			}
			cursor = await cursor.continue()
		}
	}
	return result
}
