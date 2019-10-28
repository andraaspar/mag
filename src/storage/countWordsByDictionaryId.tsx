import { IDBPTransaction } from 'idb'
import { MAX_KEY, MIN_KEY } from '../model/constants'
import { Db, getDb, INDEX_WORDS_MODIFIED_DATE_0, STORE_WORDS } from './Db'

export async function countWordsByDictionaryId({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
}): Promise<number> {
	const dictionaryIdIndex = t
		.objectStore(STORE_WORDS)
		.index(INDEX_WORDS_MODIFIED_DATE_0)
	return dictionaryIdIndex.count(
		IDBKeyRange.bound(
			[dictionaryId, MIN_KEY, MIN_KEY, MIN_KEY, MIN_KEY],
			[dictionaryId, MAX_KEY, MAX_KEY, MAX_KEY, MAX_KEY],
		),
	)
}
