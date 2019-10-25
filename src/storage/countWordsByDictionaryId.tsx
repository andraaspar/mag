import { IDBPTransaction } from 'idb'
import { Db, getDb, INDEX_WORDS_DICTIONARY_ID, STORE_WORDS } from './Db'

export async function countWordsByDictionaryId({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
}): Promise<number> {
	const dictionaryIdIndex = t
		.objectStore(STORE_WORDS)
		.index(INDEX_WORDS_DICTIONARY_ID)
	return dictionaryIdIndex.count(dictionaryId)
}
