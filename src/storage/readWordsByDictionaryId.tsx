import { IDBPTransaction } from 'idb'
import { MAX_KEY, MIN_KEY } from '../model/constants'
import { Word, wordFromDb } from '../model/Word'
import { Db, getDb, INDEX_WORDS_MODIFIED_DATE_0, STORE_WORDS } from './Db'
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
		range: IDBKeyRange.bound(
			[dictionaryId, MIN_KEY, MIN_KEY, MIN_KEY, MIN_KEY],
			[dictionaryId, MAX_KEY, MAX_KEY, MAX_KEY, MAX_KEY],
		),
		...rest,
	})
	return words.map(wordFromDb)
}
