import React, { useContext, useRef } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { useDictionary } from '../hook/useDictionary'
import { useNumberOfQuestions } from '../hook/useNumberOfQuestions'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
import { isLoaded } from '../model/TLoadable'
import { deleteDictionary } from '../storage/deleteDictionary'
import { DictionaryComp } from './DictionaryComp'
import { FocusRefComp } from './FocusRefComp'
import { LoadableComp } from './LoadableComp'
import { ShowMessageContext } from './ShowMessageContext'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface DictionaryPageProps {}

export function DictionaryPage(props: DictionaryPageProps) {
	const history = useHistory()
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
	const showMessage = useContext(ShowMessageContext)
	const askLinkRef = useRef<HTMLAnchorElement>(null)
	const addAWordLinkRef = useRef<HTMLAnchorElement>(null)
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
							{wordCount =>
								wordCount.current ? (
									<>
										<LoadableComp
											_value={$numberOfQuestions}
											_load={loadNumberOfQuestions}
										>
											{numberOfQuestions =>
												numberOfQuestions.current ? (
													<p>
														{
															numberOfQuestions.current
														}{' '}
														kérdésem van.
													</p>
												) : (
													<p>
														Gratulálok! Mindet
														megtanultad!
													</p>
												)
											}
										</LoadableComp>
									</>
								) : (
									<p>
										Íme az új szótárad! Először{' '}
										<Link
											to='./word/'
											innerRef={addAWordLinkRef}
										>
											adj hozzá szavakat
										</Link>
										<FocusRefComp
											_focusThis={addAWordLinkRef}
										/>
										, vagy{' '}
										<Link to='./import/'>
											tölts be szavakat!
										</Link>
									</p>
								)
							}
						</LoadableComp>
						<p>
							{isLoaded($numberOfQuestions) &&
								$numberOfQuestions.current > 0 && (
									<>
										<Link
											to='./learn/'
											innerRef={askLinkRef}
										>
											Kérdezz!
										</Link>
										<FocusRefComp _focusThis={askLinkRef} />{' '}
										•{' '}
									</>
								)}
							<Link to='./word/'>Adj hozzá egy szót</Link> •{' '}
							<Link to='./words/'>Mutasd a szavakat</Link> •{' '}
							<Link to='./export/'>Mentsd ki ezt a szótárat</Link>{' '}
							• <Link to='./import/'>Tölts be szavakat</Link> •{' '}
							<Link to='./edit/'>Módosítsd ezt a szótárat</Link>{' '}
							• 
							<button
								type='button'
								onClick={async () => {
									if (
										dictionaryId != null &&
										window.confirm(
											`Biztosan törölni akarod ezt a szótárat?`,
										)
									) {
										try {
											await deleteDictionary({
												dictionaryId,
											})
											history.goBack()
										} catch (e) {
											showMessage(e)
										}
									}
								}}
							>
								Töröld ezt a szótárat
							</button>
						</p>
					</>
				) : (
					<UnknownDictionaryComp />
				)
			}
		</LoadableComp>
	)
}
