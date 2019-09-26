import preval from 'preval.macro'
import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { useMessages } from '../hook/useMessages'
import { initDb } from '../storage/Db'
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
				await initDb(showMessage)
				set$hasDb(true)
			} catch (e) {
				showMessage(e)
			}
		})()
	}, [showMessage])
	useEffect(() => {
		;(async () => {
			try {
				set$isPersistent(await navigator.storage.persist())
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
				<>
					<nav>
						<NavLink
							to='/import'
							activeStyle={{ fontWeight: 'bold' }}
						>
							Tölts be szavakat
						</NavLink>
					</nav>
					<hr />
					<Switch>
						<Route exact path='/' component={StartPage} />
						<Route path='/import' component={ImportFromFilePage} />
						<Route path='/' component={NotFoundPage} />
					</Switch>
				</>
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
