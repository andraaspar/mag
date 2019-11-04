import React, { useContext, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { useCallback } from 'use-memo-one'
import { dictionaryToString } from '../function/dictionaryToString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { countNumberOfQuestions } from '../storage/countNumberOfQuestions'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'
import { ShowMessageContext } from './ShowMessageContext'
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
	const showMessage = useContext(ShowMessageContext)
	const [$numberOfQuestions, set$numberOfQuestions] = useState<
		TLoadable<{ current: number }>
	>(null)
	const loadNumberOfQuestions = useCallback(() => {
		if (dictionaryId == null) {
			set$numberOfQuestions(0)
		} else {
			let aborted = false
			set$numberOfQuestions(Date.now())
			countNumberOfQuestions({ dictionaryId })
				.then(count => {
					if (aborted) return
					set$numberOfQuestions({ current: count })
				})
				.catch(e => {
					if (aborted) return
					showMessage(e)
					set$numberOfQuestions(e + '')
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
						<LoadableComp
							_value={$numberOfQuestions}
							_load={loadNumberOfQuestions}
						>
							{numberOfQuestions =>
								numberOfQuestions.current ? (
									<p>
										{numberOfQuestions.current} kérdésem
										van.
									</p>
								) : (
									<p>Nincs egy kérdésem se!</p>
								)
							}
						</LoadableComp>
						<p>
							<Link to='./words/'>Mutasd a szavakat</Link> •{' '}
							<Link to='./word/'>Adj hozzá egy szót</Link> •{' '}
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
