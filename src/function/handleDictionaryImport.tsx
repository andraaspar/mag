import { Dictionary } from '../model/Dictionary'
import { Word } from '../model/Word'
import {
	checkForConflictingDictionary,
	DictionaryNameConflictError,
} from '../storage/checkForConflictingDictionary'
import { checkForConflictingWord } from '../storage/checkForConflictingWord'
import { getDb, STORE_DICTIONARIES, STORE_WORDS } from '../storage/Db'
import { storeDictionary } from '../storage/storeDictionary'
import { storeWord } from '../storage/storeWord'
import { asyncFilter } from './asyncFilter'
import { withInterface } from './withInterface'

export async function handleDictionaryImport({
	dictionary,
	words,
}: {
	dictionary: Dictionary
	words: readonly Word[]
}) {
	const t = getDb().transaction(
		[STORE_DICTIONARIES, STORE_WORDS],
		'readwrite',
	)
	let dictionaryId: number
	try {
		await checkForConflictingDictionary({
			t,
			dictionary,
		})
		dictionaryId = await storeDictionary({
			t,
			dictionary,
		})
	} catch (e) {
		if (e instanceof DictionaryNameConflictError) {
			dictionaryId = e.dictionary.id!
		} else {
			throw e
		}
	}
	const wordsWithDictionaryId = words.map(word =>
		withInterface<Word>({
			...word,
			dictionaryId,
		}),
	)
	const wordsNotConflicting = await asyncFilter(wordsWithDictionaryId, word =>
		checkForConflictingWord({
			t,
			word,
		}).then(() => true, () => false),
	)
	for (const word of wordsNotConflicting) {
		await storeWord({
			t,
			word,
		})
	}
	await t.done
}
