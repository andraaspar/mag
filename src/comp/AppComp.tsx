import preval from 'preval.macro'
import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { setStringToIdbSortableMap } from '../function/stringToIdbSortable'
import { useMessages } from '../hook/useMessages'
import {
	initDb,
	KEY_SETTINGS_STRING_TO_IDB_SORTABLE_MAP,
	STORE_SETTINGS,
} from '../storage/Db'
import { CreateDictionaryPage } from './CreateDictionaryPage'
import { DictionaryPage } from './DictionaryPage'
import { ExportDictionaryPage } from './ExportDictionaryPage'
import { ImportFromFilePage } from './ImportFromFilePage'
import { MessagesComp } from './MessagesComp'
import { NotFoundPage } from './NotFoundPage'
import { ShowMessageContext } from './ShowMessageContext'
import { StartPage } from './StartPage'

export function AppComp() {
	const [$hasDb, set$hasDb] = useState(false)
	const [$isPersistent, set$isPersistent] = useState<boolean | null>(null)

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
	useEffect(() => {
		;(async () => {
			try {
				set$isPersistent(
					!!navigator.storage && (await navigator.storage.persist()),
				)
			} catch (e) {
				showMessage(e)
			}
		})()
	}, [showMessage])
	return (
		<ShowMessageContext.Provider value={showMessage}>
			<header>
				<p>
					<strong>
						<Link to='/'>Mag!</Link>
					</strong>
				</p>
			</header>
			<hr />
			<MessagesComp
				_messages={messages}
				_removeMessageByIndex={removeMessageByIndex}
			/>
			{!$hasDb && (
				<p>
					<em>Adatbázis kő...</em>
				</p>
			)}
			{$hasDb && (
				<Switch>
					<Route exact path='/' component={StartPage} />
					<Route path='/import/' component={ImportFromFilePage} />
					<Route
						exact
						path='/dictionary/'
						component={CreateDictionaryPage}
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
					<Route path='/' component={NotFoundPage} />
				</Switch>
			)}
			<hr />
			<footer>
				<p>
					<small>
						Verzió:{' '}
						{preval`module.exports = new Date().toLocaleString()`}
						{$isPersistent && (
							<>
								{' • '}
								<strong>Maradandó tárhelyem van.</strong>
							</>
						)}
					</small>
				</p>
			</footer>
		</ShowMessageContext.Provider>
	)
}
