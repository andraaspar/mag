import {
	Db,
	getDb,
	INDEX_WORDS_COUNT_0,
	STORE_DICTIONARIES,
	STORE_WORDS,
	TUpdateTransaction,
} from './Db'
import { makeKeyRangeWordsCount } from './makeKeyRangeWordsCount'

export async function deleteDictionary({
	t = getDb().transaction([STORE_DICTIONARIES, STORE_WORDS], 'readwrite'),
	dictionaryId,
}: {
	t?: TUpdateTransaction<Db>
	dictionaryId: number
}) {
	const wordsIndex = t.objectStore(STORE_WORDS).index(INDEX_WORDS_COUNT_0)
	let wordCursor = await wordsIndex.openCursor(
		makeKeyRangeWordsCount({ dictionaryId }),
	)
	while (wordCursor) {
		wordCursor.delete()
		wordCursor = await wordCursor.continue()
	}
	const dictionaryStore = t.objectStore(STORE_DICTIONARIES)
	dictionaryStore.delete(dictionaryId)
}
