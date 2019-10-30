import qs from 'qs'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { sanitizePageIndex } from '../function/sanitizePageIndex'
import { toggle } from '../function/toggle'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
import { useWordsByDictionaryId } from '../hook/useWordsByDictionaryId'
import { isLoaded } from '../model/TLoadable'
import { deleteWords } from '../storage/deleteWords'
import { toggleWords } from '../storage/toggleWords'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { TranslationComp } from './TranslationComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

enum BulkActions {
	Enable = 'Enable',
	Disable = 'Disable',
	Deselect = 'Deselect',
	Delete = 'Delete',
}

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
	const [$selectedWordIds, set$selectedWordIds] = useState<{
		readonly [k: string]: boolean
	}>({})
	const selectedWordsCount = useMemo(
		() => Object.keys($selectedWordIds).length,
		[$selectedWordIds],
	)
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
					<>
						<LoadableComp _value={$wordCount} _load={loadWordCount}>
							{wordCount => (
								<>
									<h1>
										<DictionaryComp
											_dictionary={dictionary.current!}
										/>{' '}
										szavai
									</h1>
									<LoadableComp
										_value={$words}
										_load={loadWords}
									>
										{words =>
											words.current == null ||
											words.current.length === 0 ? (
												<p>
													<em>
														Nem találtam egy szót
														sem.
													</em>
												</p>
											) : (
												<ol start={pageSize * page + 1}>
													{words.current.map(word => (
														<li key={word.id}>
															<input
																type='checkbox'
																checked={
																	!!$selectedWordIds[
																		word.id +
																			''
																	]
																}
																onChange={e => {
																	set$selectedWordIds(
																		toggle(
																			$selectedWordIds,
																			word.id +
																				'',
																			e
																				.target
																				.checked,
																		),
																	)
																}}
															/>{' '}
															<Link
																to={`../word/${word.id}/`}
															>
																<TranslationComp
																	_translation={
																		word.translation0
																	}
																/>
																{` = `}
																<TranslationComp
																	_translation={
																		word.translation1
																	}
																/>
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
						<p>
							<Link to={`../word/`}>Adj hozzá egy szót</Link>
							{' • '}
							<select
								value=''
								onChange={async e => {
									switch (e.target.value) {
										case BulkActions.Deselect:
											set$selectedWordIds({})
											break
										case BulkActions.Disable:
											await toggleWords({
												dictionaryId: dictionary.current!
													.id!,
												wordIds: Object.keys(
													$selectedWordIds,
												).map(_ => +_),
												enable: false,
											})
											set$selectedWordIds({})
											loadDictionary()
											break
										case BulkActions.Enable:
											await toggleWords({
												dictionaryId: dictionary.current!
													.id!,
												wordIds: Object.keys(
													$selectedWordIds,
												).map(_ => +_),
												enable: true,
											})
											set$selectedWordIds({})
											loadDictionary()
											break
										case BulkActions.Delete:
											if (
												window.confirm(
													`Biztosan törölni akarod a kiválasztott szavakat?`,
												)
											) {
												await deleteWords({
													dictionaryId: dictionary.current!
														.id!,
													wordIds: Object.keys(
														$selectedWordIds,
													).map(_ => +_),
												})
												set$selectedWordIds({})
												loadDictionary()
											}
											break
									}
								}}
							>
								<option value=''>
									{selectedWordsCount
										? `A kiválasztott szavakat...`
										: `Az összes szót...`}
								</option>
								{selectedWordsCount > 0 && (
									<option value={BulkActions.Deselect}>
										ne válaszd ki
									</option>
								)}
								<option value={BulkActions.Enable}>
									kapcsold be
								</option>
								<option value={BulkActions.Disable}>
									kapcsold ki
								</option>
								{selectedWordsCount > 0 && (
									<option value={BulkActions.Delete}>
										töröld
									</option>
								)}
							</select>
						</p>
					</>
				)
			}
		</LoadableComp>
	)
}
