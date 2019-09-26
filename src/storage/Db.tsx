import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from 'idb'
import { dateToString } from '../function/dateToString'
import { Dictionary, Dictionary1 } from '../model/Dictionary'
import { Word } from '../model/Word'

export const DB_NAME = 'mag'
export const DEPRECATED_STORE_WORDLISTS = 'wordlists'
export const STORE_DICTIONARIES = 'dictionaries'
export const STORE_WORDS = 'words'
export const INDEX_DICTIONARIES_NAME = 'name'
export const INDEX_WORDS_DICTIONARY_ID = 'dictionaryId'
export const INDEX_WORDS_COUNT_0 = 'count0'
export const INDEX_WORDS_COUNT_1 = 'count1'
export const INDEX_WORDS_TRANSLATION_0 = 'translation0'
export const INDEX_WORDS_TRANSLATION_1 = 'translation1'

export interface Db extends DBSchema {
	dictionaries: {
		key: number
		value: Dictionary
		indexes: {
			[INDEX_DICTIONARIES_NAME]: string
		}
	}
	words: {
		key: number
		value: Word
		indexes: {
			[INDEX_WORDS_DICTIONARY_ID]: number
			[INDEX_WORDS_COUNT_0]: [number, number]
			[INDEX_WORDS_COUNT_1]: [number, number]
			[INDEX_WORDS_TRANSLATION_0]: [number, string, string]
			[INDEX_WORDS_TRANSLATION_1]: [number, string, string]
		}
	}
}

export interface Db1 extends DBSchema {
	wordlists: {
		key: number
		value: Dictionary1
		indexes: {
			name: string
		}
	}
}

let db: IDBPDatabase<Db> | null = null

export function getDb() {
	if (!db) throw new Error(`[pye4b8]`)
	return db
}

export async function initDb(showMessage: (message: any) => void) {
	db = await openDB<Db>(DB_NAME, 2, {
		async upgrade(db, oldVersion, newVersion, transaction) {
			try {
				const dictionariesStore = db.createObjectStore(
					STORE_DICTIONARIES,
					{
						keyPath: 'id',
						autoIncrement: true,
					},
				)
				dictionariesStore.createIndex(INDEX_DICTIONARIES_NAME, 'name', {
					unique: true,
				})
				const wordsStore = db.createObjectStore(STORE_WORDS, {
					keyPath: 'id',
					autoIncrement: true,
				})
				wordsStore.createIndex(
					INDEX_WORDS_DICTIONARY_ID,
					'dictionaryId',
				)
				wordsStore.createIndex(INDEX_WORDS_COUNT_0, [
					'dictionaryId',
					'translation0.count',
				])
				wordsStore.createIndex(INDEX_WORDS_COUNT_1, [
					'dictionaryId',
					'translation1.count',
				])
				wordsStore.createIndex(
					INDEX_WORDS_TRANSLATION_0,
					[
						'dictionaryId',
						'translation0.text',
						'translation0.description',
					],
					{
						unique: true,
					},
				)
				wordsStore.createIndex(
					INDEX_WORDS_TRANSLATION_1,
					[
						'dictionaryId',
						'translation1.text',
						'translation1.description',
					],
					{
						unique: true,
					},
				)
				switch (oldVersion) {
					case 1:
						await upgradeDb1To2(
							(transaction as unknown) as IDBPTransaction<
								Db1 | Db
							>,
						)
				}
			} catch (e) {
				showMessage(e)
			}
		},
		blocked() {
			showMessage(
				`[pycho4] Az adatbázist nem tudom a szükséges szintre fejleszteni, mert egy másik fülön nyitva van.`,
			)
		},
		blocking() {
			showMessage(
				`[pychpy] Egy másik fül szeretné az adatbázist fejleszteni, de nem képes rá, mert ez a fül nyitva van.`,
			)
		},
	})
	return db
}

async function upgradeDb1To2(t: IDBPTransaction<Db1 | Db>) {
	const wordlistsStore = t.objectStore(DEPRECATED_STORE_WORDLISTS)
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	const wordsStore = t.objectStore(STORE_WORDS)
	let cursor = await wordlistsStore.openCursor()
	while (cursor) {
		const dictionary1 = cursor.value
		const dictionaryId = await dictionariesStore.add({
			name: dictionary1.name,
			languages: [dictionary1.lang1Name, dictionary1.lang2Name],
		})
		for (const word1 of dictionary1.words) {
			await wordsStore.add({
				dictionaryId,
				modifiedDate: dateToString(new Date()),
				translations: [
					{
						text: word1.lang1,
						description: '',
						count: word1.lang1Count,
					},
					{
						text: word1.lang2,
						description: '',
						count: word1.lang2Count,
					},
				],
			})
		}
		cursor = await cursor.continue()
	}
	t.db.deleteObjectStore(DEPRECATED_STORE_WORDLISTS)
	await t.done
}
