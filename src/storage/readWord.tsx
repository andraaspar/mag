import { IDBPTransaction } from 'idb'
import { wordFromDb } from '../model/Word'
import { Db, getDb, STORE_WORDS } from './Db'

export async function readWord({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	wordId,
}: {
	t?: IDBPTransaction<Db>
	wordId: number
}) {
	const word = await t.objectStore(STORE_WORDS).get(wordId)
	return word && wordFromDb(word)
}
