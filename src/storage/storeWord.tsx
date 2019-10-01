import { IDBPTransaction } from 'idb'
import { Word } from '../model/Word'
import { Db, getDb, STORE_WORDS } from './Db'

export function storeWord({
	t = getDb().transaction([STORE_WORDS], 'readwrite'),
	word,
}: {
	t?: IDBPTransaction<Db>
	word: Word
}) {
	if (word.id == null) delete word.id
	return t.objectStore(STORE_WORDS).put(word)
}
