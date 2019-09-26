import { IDBPTransaction } from 'idb'
import { Translation } from '../model/Translation'
import {
	Db,
	getDb,
	INDEX_WORDS_TRANSLATION_0,
	INDEX_WORDS_TRANSLATION_1,
	STORE_WORDS,
} from './Db'

export async function readWordByTranslation({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
	translationIndex,
	translation,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
	translationIndex: 0 | 1
	translation: Translation
}) {
	const wordsStore = t.objectStore(STORE_WORDS)
	return wordsStore
		.index(
			translationIndex === 0
				? INDEX_WORDS_TRANSLATION_0
				: INDEX_WORDS_TRANSLATION_1,
		)
		.get([dictionaryId, translation.text, translation.description])
}
