import { IDBPTransaction } from 'idb'
import { DEFAULT_COUNT } from '../model/constants'
import { Word, wordFromDb, wordToDb } from '../model/Word'
import { Db, getDb, INDEX_WORDS_MODIFIED_DATE_0, STORE_WORDS } from './Db'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'
import { readWord } from './readWord'
import { storeWord } from './storeWord'

export async function toggleWords({
	t = getDb().transaction([STORE_WORDS], 'readwrite'),
	dictionaryId,
	wordIds,
	enable,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
	wordIds: readonly number[]
	enable: boolean
}) {
	if (wordIds.length === 0) {
		const wordsIndex = t
			.objectStore(STORE_WORDS)
			.index(INDEX_WORDS_MODIFIED_DATE_0)
		let cursor = await wordsIndex.openCursor(
			makeKeyRangeWordsModifiedDate({ dictionaryId }),
		)
		while (cursor) {
			const word = wordFromDb(cursor.value)
			updateWord(word, enable)
			cursor.update(wordToDb(word))
			cursor = await cursor.continue()
		}
	} else {
		for (const wordId of wordIds) {
			const word = await readWord({ t, wordId })
			if (!word) throw new Error(`[q06uwo] Ismeretlen szó: ${wordId}`)
			updateWord(word, enable)
			await storeWord({ t, word })
		}
	}
}

export function updateWord(word: Word, enable: boolean) {
	word.translation0.count = enable ? DEFAULT_COUNT : 0
	word.translation1.count = enable ? DEFAULT_COUNT : 0
}
