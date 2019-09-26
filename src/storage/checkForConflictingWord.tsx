import { IDBPTransaction } from 'idb'
import { Word } from '../model/Word'
import { Db, getDb, STORE_WORDS } from './Db'
import { readWordByTranslation } from './readWordByTranslation'

export class ExistingTranslationError extends Error {
	constructor(public translations: [Word | undefined, Word | undefined]) {
		super('[pyeb4f] Már létező fordítás.')
	}
}

export async function checkForConflictingWord({
	t = getDb().transaction([STORE_WORDS], 'readonly'),
	word,
}: {
	t?: IDBPTransaction<Db>
	word: Word
}) {
	const existingTranslations = await Promise.all([
		readWordByTranslation({
			t,
			dictionaryId: word.dictionaryId,
			translationIndex: 0,
			translation: word.translation0,
		}),
		readWordByTranslation({
			t,
			dictionaryId: word.dictionaryId,
			translationIndex: 1,
			translation: word.translation1,
		}),
	])
	const existingTranslationsWithDifferingId = existingTranslations.map(
		other => (other && other.id !== word.id ? other : undefined),
	) as [Word | undefined, Word | undefined]
	if (
		existingTranslationsWithDifferingId[0] ||
		existingTranslationsWithDifferingId[1]
	) {
		throw new ExistingTranslationError(existingTranslationsWithDifferingId)
	}
}
