import { dictionaryFromDb } from '../model/Dictionary'
import { Db, getDb, STORE_DICTIONARIES, TAnyModeTransaction } from './Db'

export async function readDictionaryById({
	t = getDb().transaction([STORE_DICTIONARIES], 'readonly'),
	id,
}: {
	t?: TAnyModeTransaction<Db>
	id: number
}) {
	const dictionary = await t.objectStore(STORE_DICTIONARIES).get(id)
	return dictionary && dictionaryFromDb(dictionary)
}
