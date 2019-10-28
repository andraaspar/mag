import { IDBPTransaction } from 'idb/build/esm/entry'
import { MAX_KEY, MIN_KEY } from '../model/constants'
import {
	Db,
	getDb,
	INDEX_WORDS_COUNT_0,
	INDEX_WORDS_COUNT_1,
	STORE_WORDS,
} from './Db'

export async function countNumberOfQuestions({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
}): Promise<number> {
	const wordsStore = t.objectStore(STORE_WORDS)
	const index0 = wordsStore.index(INDEX_WORDS_COUNT_0)
	const index1 = wordsStore.index(INDEX_WORDS_COUNT_1)
	const count0 = await index0.count(
		IDBKeyRange.bound(
			[dictionaryId, 0, MIN_KEY, MIN_KEY],
			[dictionaryId, 0, MAX_KEY, MAX_KEY],
		),
	)
	const count1 = await index1.count(
		IDBKeyRange.bound(
			[dictionaryId, 0, MIN_KEY, MIN_KEY],
			[dictionaryId, 0, MAX_KEY, MAX_KEY],
		),
	)
	return count0 + count1
}
