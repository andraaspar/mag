import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { Db, getDb, INDEX_DICTIONARIES_NAME, STORE_DICTIONARIES } from './Db'
import { readItems, ReadItemsPagingParams } from './readItems'

export async function readDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	...rest
}: {
	t?: IDBPTransaction<Db>
} & ReadItemsPagingParams<Dictionary>): Promise<Dictionary[]> {
	const nameIndex = t
		.objectStore(STORE_DICTIONARIES)
		.index(INDEX_DICTIONARIES_NAME)
	return readItems({
		source: nameIndex,
		...rest,
	})
}
