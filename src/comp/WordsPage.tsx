import qs from 'qs'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { sanitizePageIndex } from '../function/sanitizePageIndex'
import { wordToString } from '../function/wordToString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
import { useWordsByDictionaryId } from '../hook/useWordsByDictionaryId'
import { isLoaded } from '../model/TLoadable'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface WordsPageProps {}

export function WordsPage(props: WordsPageProps) {
	const history = useHistory()
	const location = useLocation()
	const routeMatch = useRouteMatch<{ dictionaryId: string }>(
		`/dictionary/:dictionaryId/words/`,
	)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId, 10)
	const query = useMemo(
		() =>
			qs.parse(location.search.slice(1)) as {
				page: string | undefined
			},
		[location.search],
	)
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const pageSize = 10
	const { $wordCount, loadWordCount } = useWordCountByDictionaryId(
		dictionaryId,
	)
	const pageCount = isLoaded($wordCount)
		? Math.max(1, Math.ceil($wordCount.current / pageSize))
		: 1
	const page =
		query && query.page
			? sanitizePageIndex({ page: parseInt(query.page, 10), pageCount })
			: 0
	const setPage = useCallback(
		newPage => {
			history.replace(`?${qs.stringify({ page: newPage })}`)
		},
		[history],
	)
	const { $words, loadWords } = useWordsByDictionaryId({
		dictionaryId,
		page,
		pageSize,
	})
	usePageTitle(
		isLoaded($dictionary) && $dictionary.current
			? `${dictionaryToString($dictionary.current)} szavai`
			: `Szavak`,
	)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<LoadableComp _value={$wordCount} _load={loadWordCount}>
						{wordCount => (
							<>
								<h1>
									<DictionaryComp
										_dictionary={dictionary.current!}
									/>{' '}
									szavai
								</h1>
								<LoadableComp _value={$words} _load={loadWords}>
									{words =>
										words.current == null ||
										words.current.length === 0 ? (
											<p>
												<em>
													Nem találtam egy szót sem.
												</em>
											</p>
										) : (
											<ol start={pageSize * page + 1}>
												{words.current.map(word => (
													<li key={word.id}>
														<Link
															to={`../word/${word.id}/`}
														>
															{wordToString(word)}
														</Link>
													</li>
												))}
											</ol>
										)
									}
								</LoadableComp>
								{pageCount > 1 && (
									<PagingComp
										_page={page}
										_pageCount={pageCount}
										_setPage={setPage}
									/>
								)}
							</>
						)}
					</LoadableComp>
				)
			}
		</LoadableComp>
	)
}
