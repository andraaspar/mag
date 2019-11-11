import { IDBPTransaction } from 'idb'
import {
	Db,
	getDb,
	INDEX_WORDS_MODIFIED_DATE_0,
	STORE_DICTIONARIES,
	STORE_WORDS,
} from './Db'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'
import { updateDictionaryCount } from './updateDictionaryCount'

export async function deleteWords({
	t = getDb().transaction([STORE_DICTIONARIES, STORE_WORDS], 'readwrite'),
	dictionaryId,
	wordIds,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
	wordIds: readonly number[]
}) {
	const wordsStore = t.objectStore(STORE_WORDS)
	if (wordIds.length === 0) {
		const wordsIndex = t
			.objectStore(STORE_WORDS)
			.index(INDEX_WORDS_MODIFIED_DATE_0)
		let cursor = await wordsIndex.openKeyCursor(
			makeKeyRangeWordsModifiedDate({ dictionaryId }),
		)
		while (cursor) {
			await cursor.delete()
			cursor = await cursor.continue()
		}
	} else {
		for (const wordId of wordIds) {
			await wordsStore.delete(wordId)
		}
	}
	await updateDictionaryCount({ t, dictionaryId })
}
