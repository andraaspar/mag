import { IDBPTransaction } from 'idb'
import { Dictionary } from '../model/Dictionary'
import { countNumberOfQuestions } from './countNumberOfQuestions'
import { Db, getDb, STORE_DICTIONARIES, STORE_WORDS } from './Db'
import { readDictionaryById } from './readDictionaryById'
import { storeDictionary } from './storeDictionary'

export async function updateDictionaryCount({
	t = getDb().transaction([STORE_DICTIONARIES, STORE_WORDS], 'readwrite'),
	dictionaryId,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
}) {
	const existingDictionary = await readDictionaryById({ t, id: dictionaryId })
	if (!existingDictionary)
		throw new Error(`[q0t3gf] Ismeretlen szótár: ${dictionaryId}`)
	const count = await countNumberOfQuestions({
		t,
		dictionaryId,
	})
	const dictionary: Dictionary = {
		...existingDictionary,
		count,
	}
	await storeDictionary({ t: t as IDBPTransaction<Db>, dictionary })
}
