import { DbWord } from '../model/Word'
import { countItems } from './countItems'
import {
	Db,
	getDb,
	INDEX_WORDS_MODIFIED_DATE_0,
	STORE_WORDS,
	TAnyModeTransaction,
} from './Db'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'

export async function countWordsByDictionaryId({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
	filter,
}: {
	t?: TAnyModeTransaction<Db>
	dictionaryId: number
	filter?: (item: DbWord) => boolean
}): Promise<number> {
	const dictionaryIdIndex = t
		.objectStore(STORE_WORDS)
		.index(INDEX_WORDS_MODIFIED_DATE_0)
	return countItems({
		source: dictionaryIdIndex,
		range: makeKeyRangeWordsModifiedDate({ dictionaryId }),
		filter,
	})
}
