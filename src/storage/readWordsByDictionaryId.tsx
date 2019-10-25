import { IDBPTransaction } from 'idb'
import { Word } from '../model/Word'
import { Db, getDb, INDEX_WORDS_DICTIONARY_ID, STORE_WORDS } from './Db'
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
		.index(INDEX_WORDS_DICTIONARY_ID)
	return readItems({
		source: dictionaryIdIndex,
		range: IDBKeyRange.only(dictionaryId),
		...rest,
	})
}
