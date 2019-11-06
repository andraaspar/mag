import { IDBPTransaction } from 'idb'
import { withInterface } from '../function/withInterface'
import { Question } from '../model/Question'
import {
	Db,
	getDb,
	INDEX_WORDS_COUNT_0,
	INDEX_WORDS_COUNT_1,
	STORE_WORDS,
} from './Db'
import { makeKeyRangeWordsCount } from './makeKeyRangeWordsCount'

export async function readQuestions({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
}): Promise<Question[]> {
	const wordsStore = t.objectStore(STORE_WORDS)
	const translation0Index = wordsStore.index(INDEX_WORDS_COUNT_0)
	const translation1Index = wordsStore.index(INDEX_WORDS_COUNT_1)
	return [
		...(await translation0Index.getAllKeys(
			makeKeyRangeWordsCount({
				dictionaryId,
				countForSort: [0, 0],
			}),
		)).map(wordId =>
			withInterface<Question>({
				wordId,
				translationId: 0,
			}),
		),
		...(await translation1Index.getAllKeys(
			makeKeyRangeWordsCount({
				dictionaryId,
				countForSort: [0, 0],
			}),
		)).map(wordId =>
			withInterface<Question>({
				wordId,
				translationId: 1,
			}),
		),
	]
}
