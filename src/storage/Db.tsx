import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from 'idb'
import { isNumber } from 'util'
import { dateToString } from '../function/dateToString'
import { getStringToIdbSortableMap } from '../function/stringToIdbSortable'
import { DbDictionary, Dictionary1, dictionaryToDb } from '../model/Dictionary'
import { DbWord, wordToDb } from '../model/Word'
import { updateDictionaryCount } from './updateDictionaryCount'

export const DB_NAME = 'mag'

export const DEPRECATED_STORE_WORDLISTS = 'wordlists'

export const STORE_DICTIONARIES = 'dictionaries'
export const INDEX_DICTIONARIES_NAME = 'name'
export const INDEX_DICTIONARIES_LANGUAGE_0 = 'language0'
export const INDEX_DICTIONARIES_LANGUAGE_1 = 'language1'
export const INDEX_DICTIONARIES_COUNT_NAME = 'countName'

export const STORE_WORDS = 'words'
export const INDEX_WORDS_COUNT_0 = 'count0'
export const INDEX_WORDS_COUNT_1 = 'count1'
export const INDEX_WORDS_TRANSLATION_0 = 'translation0'
export const INDEX_WORDS_TRANSLATION_1 = 'translation1'
export const INDEX_WORDS_MODIFIED_DATE_0 = 'modifiedDateForSort0'
export const INDEX_WORDS_MODIFIED_DATE_1 = 'modifiedDateForSort1'
export const INDEX_WORDS_COUNT_TRANSLATION_0 = 'countTranslation0'
export const INDEX_WORDS_COUNT_TRANSLATION_1 = 'countTranslation1'

export const STORE_SETTINGS = 'settings'
export const KEY_SETTINGS_STRING_TO_IDB_SORTABLE_MAP = 'stringToIdbSortableMap'

export interface Db extends DBSchema {
	dictionaries: {
		key: number
		value: DbDictionary
		indexes: {
			[INDEX_DICTIONARIES_NAME]: string
			[INDEX_DICTIONARIES_LANGUAGE_0]: string
			[INDEX_DICTIONARIES_LANGUAGE_1]: string
			[INDEX_DICTIONARIES_COUNT_NAME]: [number, string]
		}
	}
	words: {
		key: number
		value: DbWord
		indexes: {
			[INDEX_WORDS_COUNT_0]: [number, number]
			[INDEX_WORDS_COUNT_1]: [number, number]
			[INDEX_WORDS_TRANSLATION_0]: [number, string, string]
			[INDEX_WORDS_TRANSLATION_1]: [number, string, string]
			[INDEX_WORDS_MODIFIED_DATE_0]: [
				number,
				string,
				number,
				string,
				string,
			]
			[INDEX_WORDS_MODIFIED_DATE_1]: [
				number,
				string,
				number,
				string,
				string,
			]
			[INDEX_WORDS_COUNT_TRANSLATION_0]: [number, number, string, string]
			[INDEX_WORDS_COUNT_TRANSLATION_1]: [number, number, string, string]
		}
	}
	settings: {
		key: string
		value: any
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
	db = await openDB<Db>(DB_NAME, 3, {
		async upgrade(db, oldVersion, newVersion, t) {
			try {
				if (oldVersion < 2) {
					await createDb2(t)
				}
				switch (oldVersion) {
					case 1:
						await upgradeDb1To2((t as unknown) as IDBPTransaction<
							Db1 | Db
						>)
						break
				}
				if (oldVersion < 3) {
					await upgradeDb2To3(t)
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

async function createDb2(t: IDBPTransaction<Db>) {
	const dictionariesStore = t.db.createObjectStore(STORE_DICTIONARIES, {
		keyPath: 'id',
		autoIncrement: true,
	})
	dictionariesStore.createIndex(INDEX_DICTIONARIES_NAME, 'nameForSort', {
		unique: true,
	})
	dictionariesStore.createIndex(
		INDEX_DICTIONARIES_LANGUAGE_0,
		'language0ForSort',
	)
	dictionariesStore.createIndex(
		INDEX_DICTIONARIES_LANGUAGE_1,
		'language1ForSort',
	)

	const wordsStore = t.db.createObjectStore(STORE_WORDS, {
		keyPath: 'id',
		autoIncrement: true,
	})
	wordsStore.createIndex(INDEX_WORDS_COUNT_0, [
		'dictionaryId',
		'translation0.countForSort',
	])
	wordsStore.createIndex(INDEX_WORDS_COUNT_1, [
		'dictionaryId',
		'translation1.countForSort',
	])
	wordsStore.createIndex(INDEX_WORDS_MODIFIED_DATE_0, [
		'dictionaryId',
		'modifiedDateForSort',
		'countForSort',
		'translation0.textForSort',
		'translation0.descriptionForSort',
	])
	wordsStore.createIndex(INDEX_WORDS_MODIFIED_DATE_1, [
		'dictionaryId',
		'modifiedDateForSort',
		'countForSort',
		'translation1.textForSort',
		'translation1.descriptionForSort',
	])
	wordsStore.createIndex(INDEX_WORDS_COUNT_TRANSLATION_0, [
		'dictionaryId',
		'countForSort',
		'translation0.textForSort',
		'translation0.descriptionForSort',
	])
	wordsStore.createIndex(INDEX_WORDS_COUNT_TRANSLATION_1, [
		'dictionaryId',
		'countForSort',
		'translation1.textForSort',
		'translation1.descriptionForSort',
	])
	wordsStore.createIndex(
		INDEX_WORDS_TRANSLATION_0,
		['dictionaryId', 'translation0.text', 'translation0.description'],
		{
			unique: true,
		},
	)
	wordsStore.createIndex(
		INDEX_WORDS_TRANSLATION_1,
		['dictionaryId', 'translation1.text', 'translation1.description'],
		{
			unique: true,
		},
	)

	const settingsStore = t.db.createObjectStore(STORE_SETTINGS)
	settingsStore.put(
		getStringToIdbSortableMap(),
		KEY_SETTINGS_STRING_TO_IDB_SORTABLE_MAP,
	)
}

async function upgradeDb1To2(t: IDBPTransaction<Db1 | Db>) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	const wordsStore = t.objectStore(STORE_WORDS)
	const wordlistsStore = t.objectStore(DEPRECATED_STORE_WORDLISTS)
	let cursor = await wordlistsStore.openCursor()
	while (cursor) {
		const dictionary1 = cursor.value
		const dictionaryId = await dictionariesStore.put(
			dictionaryToDb({
				name: dictionary1.name,
				language0: dictionary1.lang1Name,
				language1: dictionary1.lang2Name,
				count: 0,
			}),
		)
		if (isNumber(dictionaryId)) {
			for (const word1 of dictionary1.words) {
				await wordsStore.put(
					wordToDb({
						dictionaryId,
						modifiedDate: dateToString(new Date()),
						translation0: {
							text: word1.lang1,
							description: '',
							count: word1.lang1Count,
						},
						translation1: {
							text: word1.lang2,
							description: '',
							count: word1.lang2Count,
						},
					}),
				)
			}
		}
		cursor = await cursor.continue()
	}
	t.db.deleteObjectStore(DEPRECATED_STORE_WORDLISTS)
}

async function upgradeDb2To3(t: IDBPTransaction<Db>) {
	const dictionariesStore = t.objectStore(STORE_DICTIONARIES)
	let cursor = await dictionariesStore.openKeyCursor()
	while (cursor) {
		await updateDictionaryCount({ t, dictionaryId: cursor.primaryKey })
		cursor = await cursor.continue()
	}
	dictionariesStore.createIndex(INDEX_DICTIONARIES_COUNT_NAME, [
		'countForSort',
		'nameForSort',
	])
}
