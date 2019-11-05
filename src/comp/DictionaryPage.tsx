import React from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { useDictionary } from '../hook/useDictionary'
import { useNumberOfQuestions } from '../hook/useNumberOfQuestions'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
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
	const { $numberOfQuestions, loadNumberOfQuestions } = useNumberOfQuestions(
		dictionaryId,
	)
	const { $wordCount, loadWordCount } = useWordCountByDictionaryId({
		dictionaryId,
	})
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
						<LoadableComp _value={$wordCount} _load={loadWordCount}>
							{wordCount => (
								<LoadableComp
									_value={$numberOfQuestions}
									_load={loadNumberOfQuestions}
								>
									{numberOfQuestions =>
										numberOfQuestions.current ? (
											<p>
												{numberOfQuestions.current}{' '}
												kérdésem van.
											</p>
										) : wordCount.current ? (
											<p>
												Gratulálok! Mindet megtanultad!
											</p>
										) : (
											<p>
												Íme az új szótárad! Először{' '}
												<Link to='./word/'>
													adj hozzá szavakat!
												</Link>
											</p>
										)
									}
								</LoadableComp>
							)}
						</LoadableComp>
						<p>
							{isLoaded($numberOfQuestions) &&
								$numberOfQuestions.current > 0 && (
									<>
										<Link to='./learn/'>Kérdezz!</Link> •{' '}
									</>
								)}
							<Link to='./word/'>Adj hozzá egy szót</Link> •{' '}
							<Link to='./words/'>Mutasd a szavakat</Link> •{' '}
							<Link to='./export/'>Mentsd ki ezt a szótárat</Link>{' '}
							• <Link to='./import/'>Tölts be szavakat</Link>
						</p>
					</>
				) : (
					<UnknownDictionaryComp />
				)
			}
		</LoadableComp>
	)
}
