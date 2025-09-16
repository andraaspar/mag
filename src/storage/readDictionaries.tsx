import { Dictionary, dictionaryFromDb } from '../model/Dictionary'
import {
	Db,
	getDb,
	INDEX_DICTIONARIES_COUNT_NAME,
	STORE_DICTIONARIES,
	TAnyModeTransaction,
} from './Db'
import { readItems, ReadItemsPagingParams } from './readItems'

export async function readDictionaries({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	...rest
}: {
	t?: TAnyModeTransaction<Db>
} & ReadItemsPagingParams<Dictionary>): Promise<Dictionary[]> {
	const nameIndex = t
		.objectStore(STORE_DICTIONARIES)
		.index(INDEX_DICTIONARIES_COUNT_NAME)
	const dictionaries = await readItems({
		source: nameIndex,
		...rest,
	})
	return dictionaries.map(dictionaryFromDb)
}
