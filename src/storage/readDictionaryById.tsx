import { IDBPTransaction } from 'idb'
import { dictionaryFromDb } from '../model/Dictionary'
import { Db, getDb, STORE_DICTIONARIES } from './Db'

export async function readDictionaryById({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	id,
}: {
	t?: IDBPTransaction<Db>
	id: number
}) {
	const dictionary = await t.objectStore(STORE_DICTIONARIES).get(id)
	return dictionary && dictionaryFromDb(dictionary)
}
