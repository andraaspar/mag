import { IDBPTransaction } from 'idb'
import { Word, wordFromDb } from '../model/Word'
import { Db, getDb, INDEX_WORDS_MODIFIED_DATE_0, STORE_WORDS } from './Db'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'
import { readItems, ReadItemsPagingParams } from './readItems'

export async function readWordsByDictionaryId({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
	...rest
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
} & Omit<ReadItemsPagingParams<Word>, 'range'>): Promise<Word[]> {
	const dictionaryIdIndex = t
		.objectStore(STORE_WORDS)
		.index(INDEX_WORDS_MODIFIED_DATE_0)
	const words = await readItems({
		source: dictionaryIdIndex,
		range: makeKeyRangeWordsModifiedDate(dictionaryId),
		...rest,
	})
	return words.map(wordFromDb)
}
