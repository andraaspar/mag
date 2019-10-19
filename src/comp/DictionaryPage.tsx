import * as React from 'react'
import { useCallback, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { useMessages } from '../hook/useMessages'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { readDictionaryById } from '../storage/readDictionaryById'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'

export interface DictionaryPageProps {}

export function DictionaryPage(props: DictionaryPageProps) {
	const routeMatch = useRouteMatch<{ dictionaryId: string }>(
		'/dictionary/:dictionaryId',
	)
	const dictionaryId = routeMatch
		? parseInt(routeMatch.params.dictionaryId, 10)
		: null
	const [$dictionary, set$dictionary] = useState<
		TLoadable<{ current: Dictionary | undefined }>
	>({ current: undefined })
	const { showMessage } = useMessages()
	const loadDictionary = useCallback(() => {
		if (dictionaryId == null) {
			set$dictionary({ current: undefined })
		} else {
			let aborted = false
			set$dictionary(Date.now())
			readDictionaryById({ id: dictionaryId })
				.then(dictionary => {
					if (aborted) return
					set$dictionary({ current: dictionary })
				})
				.catch(e => {
					showMessage(e)
					set$dictionary(e + '')
				})
			return () => {
				aborted = true
			}
		}
	}, [dictionaryId, showMessage])
	usePageTitle(
		!isLoaded($dictionary)
			? `Szótár`
			: $dictionary.current
			? dictionaryToString($dictionary.current)
			: `Ismeretlen szótár`,
	)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current ? (
					<>
						<h1>
							<DictionaryComp _dictionary={dictionary.current} />
						</h1>
						<p>
							<Link to='./export/'>
								El akarom tenni ezt a szótárat
							</Link>
						</p>
					</>
				) : (
					<>
						<h1>Ismeretlen szótár</h1>
						<p>
							Ez a szótár nem létezik.{' '}
							<Link to='/'>Menj vissza a kezdőoldalra</Link>, és
							válassz egy másikat!
						</p>
					</>
				)
			}
		</LoadableComp>
	)
}
