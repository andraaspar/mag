import { IDBPTransaction } from 'idb'
import { Word, wordFromDb } from '../model/Word'
import {
	Db,
	getDb,
	INDEX_WORDS_COUNT_TRANSLATION_0,
	INDEX_WORDS_COUNT_TRANSLATION_1,
	INDEX_WORDS_MODIFIED_DATE_0,
	INDEX_WORDS_MODIFIED_DATE_1,
	STORE_WORDS,
} from './Db'
import { makeKeyRangeWordsCountTranslation } from './makeKeyRangeWordsCountTranslation'
import { makeKeyRangeWordsModifiedDate } from './makeKeyRangeWordsModifiedDate'
import { readItems, ReadItemsPagingParams } from './readItems'

export enum WordsByDictionaryIdSort {
	ModifiedDate0,
	ModifiedDate1,
	CountTranslation0,
	CountTranslation1,
}

export async function readWordsByDictionaryId({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	dictionaryId,
	sort = WordsByDictionaryIdSort.ModifiedDate0,
	...rest
}: {
	t?: IDBPTransaction<Db>
	dictionaryId: number
	sort?: WordsByDictionaryIdSort
} & Omit<ReadItemsPagingParams<Word>, 'range'>): Promise<Word[]> {
	const dictionaryIdIndex = t
		.objectStore(STORE_WORDS)
		.index(getIndexName(sort))
	const words = await readItems({
		source: dictionaryIdIndex,
		range: makeKeyRange(dictionaryId, sort),
		...rest,
	})
	return words.map(wordFromDb)
}

function getIndexName(sort: WordsByDictionaryIdSort) {
	switch (sort) {
		case WordsByDictionaryIdSort.CountTranslation0:
			return INDEX_WORDS_COUNT_TRANSLATION_0
		case WordsByDictionaryIdSort.CountTranslation1:
			return INDEX_WORDS_COUNT_TRANSLATION_1
		case WordsByDictionaryIdSort.ModifiedDate0:
			return INDEX_WORDS_MODIFIED_DATE_0
		case WordsByDictionaryIdSort.ModifiedDate1:
			return INDEX_WORDS_MODIFIED_DATE_1
	}
	throw new Error(`[q0733u]`)
}

function makeKeyRange(dictionaryId: number, sort: WordsByDictionaryIdSort) {
	switch (sort) {
		case WordsByDictionaryIdSort.CountTranslation0:
		case WordsByDictionaryIdSort.CountTranslation1:
			return makeKeyRangeWordsCountTranslation({ dictionaryId })
		case WordsByDictionaryIdSort.ModifiedDate0:
		case WordsByDictionaryIdSort.ModifiedDate1:
			return makeKeyRangeWordsModifiedDate({ dictionaryId })
	}
	throw new Error(`[q0736h]`)
}
