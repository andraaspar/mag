import { IDBPTransaction } from 'idb'
import { Db, getDb, INDEX_WORDS_MODIFIED_DATE_0, STORE_WORDS } from './Db'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'

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
	return dictionaryIdIndex.count(makeKeyRangeWordsModifiedDate(dictionaryId))
}
