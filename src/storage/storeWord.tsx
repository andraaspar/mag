import { Word, wordToDb } from '../model/Word'
import { Db, getDb, STORE_WORDS, TUpdateTransaction } from './Db'

export function storeWord({
	t = getDb().transaction([STORE_WORDS], 'readwrite'),
	word,
}: {
	t?: TUpdateTransaction<Db>
	word: Word
}) {
	if (word.id == null) delete word.id
	return t.objectStore(STORE_WORDS).put(wordToDb(word))
}
