import * as React from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { isLoaded } from '../model/TLoadable'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface DictionaryPageProps {}

export function DictionaryPage(props: DictionaryPageProps) {
	const routeMatch = useRouteMatch<{ dictionaryId: string }>(
		'/dictionary/:dictionaryId/',
	)
	const dictionaryId = routeMatch
		? parseInt(routeMatch.params.dictionaryId, 10)
		: null
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
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
							<Link to='./export/'>Mentsd ki ezt a szótárat</Link>
						</p>
					</>
				) : (
					<UnknownDictionaryComp />
				)
			}
		</LoadableComp>
	)
}
