import preval from 'preval.macro'
import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { setStringToIdbSortableMap } from '../function/stringToIdbSortable'
import { useMessages } from '../hook/useMessages'
import { usePersistentStorage } from '../hook/usePersistentStorage'
import { WARNING_CHARACTER } from '../model/constants'
import {
	initDb,
	KEY_SETTINGS_STRING_TO_IDB_SORTABLE_MAP,
	STORE_SETTINGS,
} from '../storage/Db'
import styles from './AppComp.module.css'
import { DictionaryPage } from './DictionaryPage'
import { EditDictionaryPage } from './EditDictionaryPage'
import { EditWordPage } from './EditWordPage'
import { ExportDictionaryPage } from './ExportDictionaryPage'
import { ImportFromFilePage } from './ImportFromFilePage'
import { LearnPage } from './LearnPage'
import { LoadableComp } from './LoadableComp'
import { MessagesComp } from './MessagesComp'
import { NotFoundPage } from './NotFoundPage'
import { RowComp } from './RowComp'
import { ShowMessageContext } from './ShowMessageContext'
import { SpacerComp } from './SpacerComp'
import { StartPage } from './StartPage'
import { WordsPage } from './WordsPage'

export function AppComp() {
	const [$hasDb, set$hasDb] = useState(false)
	const {
		$isPersistentStorage,
		set$isPersistentStorage,
		loadPersistentStorage,
	} = usePersistentStorage()

	const { messages, showMessage, removeMessageByIndex } = useMessages()

	useEffect(() => {
		;(async () => {
			try {
				const db = await initDb(showMessage)
				const t = db.transaction(STORE_SETTINGS, 'readonly')
				const settingsStore = t.objectStore(STORE_SETTINGS)
				setStringToIdbSortableMap(
					await settingsStore.get(
						KEY_SETTINGS_STRING_TO_IDB_SORTABLE_MAP,
					),
				)
				set$hasDb(true)
			} catch (e) {
				showMessage(e)
			}
		})()
	}, [showMessage])
	return (
		<ShowMessageContext.Provider value={showMessage}>
			<RowComp _isVertical _gap={20} _padding={20} _fill>
				<div className={styles.header}>
					<Link to='/'>Mag</Link>
				</div>
				<RowComp _isVertical>
					<MessagesComp
						_messages={messages}
						_removeMessageByIndex={removeMessageByIndex}
					/>
					{!$hasDb && (
						<p>
							<em>Adatbázis nélkül nem megy...</em>
						</p>
					)}
					{$hasDb && (
						<Switch>
							<Route exact path='/' component={StartPage} />
							<Route
								path='/import/'
								component={ImportFromFilePage}
							/>
							<Route
								exact
								path='/dictionary/'
								component={EditDictionaryPage}
							/>
							<Route
								exact
								path='/dictionary/:dictionaryId/'
								component={DictionaryPage}
							/>
							<Route
								path='/dictionary/:dictionaryId/export/'
								component={ExportDictionaryPage}
							/>
							<Route
								path='/dictionary/:dictionaryId/word/'
								component={EditWordPage}
							/>
							<Route
								path='/dictionary/:dictionaryId/words/'
								component={WordsPage}
							/>
							<Route
								path='/dictionary/:dictionaryId/import/'
								component={ImportFromFilePage}
							/>
							<Route
								path='/dictionary/:dictionaryId/learn/'
								component={LearnPage}
							/>
							<Route
								path='/dictionary/:dictionaryId/edit/'
								component={EditDictionaryPage}
							/>
							<Route path='/' component={NotFoundPage} />
						</Switch>
					)}
				</RowComp>
				<SpacerComp />
				<div className={styles.footer}>
					Verzió:{' '}
					{preval`module.exports = new Date().toLocaleString()`}
					{' • '}
					<strong>
						<LoadableComp
							_value={$isPersistentStorage}
							_load={loadPersistentStorage}
						>
							{isPersistentStorage =>
								isPersistentStorage.current ? (
									<>Maradandó tárhelyem van.</>
								) : (
									<>
										{WARNING_CHARACTER} Nincs maradandó
										tárhelyem!{' '}
										<button
											type='button'
											onClick={async () => {
												if (navigator.storage) {
													const isPersistent = await navigator.storage.persist()
													if (isPersistent) {
														set$isPersistentStorage(
															null,
														)
													}
												} else {
													showMessage(
														`Ez a böngésző nem támogatja a maradandó tárhelyet!`,
													)
												}
											}}
										>
											Javítsd meg
										</button>
									</>
								)
							}
						</LoadableComp>
					</strong>
				</div>
			</RowComp>
		</ShowMessageContext.Provider>
	)
}
