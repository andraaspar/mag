import { useCallback, useMemo, useState } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { queryToRegExp } from '../function/queryToRegExp'
import { sanitizeEnumValue } from '../function/sanitizeEnumValue'
import { sanitizePageIndex } from '../function/sanitizePageIndex'
import { wordToString } from '../function/wordToString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
import { useWordsByDictionaryId } from '../hook/useWordsByDictionaryId'
import { CLOSE_CHARACTER } from '../model/constants'
import { isLoaded } from '../model/TLoadable'
import { TSelection } from '../model/TSelection'
import { DbWord } from '../model/Word'
import { WordsByDictionaryIdSort } from '../storage/readWordsByDictionaryId'
import { DictionaryComp } from './DictionaryComp'
import { IconComp } from './IconComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'
import { WordListByDateComp } from './WordListByDateComp'
import { WordListComp } from './WordListComp'
import { WordsMenuComp } from './WordsMenuComp'
import { WordsSortComp } from './WordsSortComp'

export interface WordsPageProps {}

export function WordsPage(props: WordsPageProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const routeMatch = useMatch(`/dictionary/:dictionaryId/words/`)
	const dictionaryId = routeMatch?.params.dictionaryId
		? parseInt(routeMatch.params.dictionaryId, 10)
		: undefined
	const query = useMemo(() => {
		const params = new URLSearchParams(location.search)
		return {
			q: params.get('q'),
			page: params.get('page'),
			sort: params.get('sort'),
		}
	}, [location.search])
	const q = query.q ?? ''
	const filter = useMemo(() => {
		const qRe = queryToRegExp(q)
		return qRe
			? (word: DbWord) => {
					return qRe.test(wordToString(word))
			  }
			: undefined
	}, [q])
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const pageSize = 10
	const { $wordCount, loadWordCount } = useWordCountByDictionaryId({
		dictionaryId,
		filter,
	})
	const pageCount = isLoaded($wordCount)
		? Math.max(1, Math.ceil($wordCount.current / pageSize))
		: 1
	const page =
		query && query.page
			? sanitizePageIndex({ page: parseInt(query.page, 10), pageCount })
			: 0
	const sort =
		query && query.sort != null
			? sanitizeEnumValue<WordsByDictionaryIdSort>(
					WordsByDictionaryIdSort,
					parseInt(query.sort, 10),
			  )
			: WordsByDictionaryIdSort.ModifiedDate0
	const setQ = useCallback(
		(q: string) => {
			navigate(
				'?' +
					new URLSearchParams({
						q,
						sort: sort + '',
						page: page + '',
					}).toString(),
				{ replace: true },
			)
		},
		[navigate, page, sort],
	)
	const setPage = useCallback(
		(newPage: number) => {
			navigate(
				'?' +
					new URLSearchParams({
						q,
						sort: sort + '',
						page: newPage + '',
					}).toString(),
				{
					replace: true,
				},
			)
		},
		[navigate, q, sort],
	)
	const setSort = useCallback(
		(newSort: WordsByDictionaryIdSort) => {
			navigate(
				'?' + new URLSearchParams({ q, sort: newSort + '', page: page + '' }),
				{
					replace: true,
				},
			)
		},
		[navigate, q, page],
	)
	const { $words, loadWords } = useWordsByDictionaryId({
		dictionaryId,
		page,
		pageSize,
		sort,
		filter,
	})
	const [$selectedWordIds, set$selectedWordIds] = useState<TSelection>({})
	usePageTitle(
		isLoaded($dictionary) && $dictionary.current
			? `${dictionaryToString($dictionary.current)} szavai`
			: `Szavak`,
	)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{(dictionary) =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<div className='ccc_col ccc_gap_0_5'>
						<h1>
							<DictionaryComp _dictionary={dictionary.current!} /> szavai
						</h1>
						<div className='ccc_para'>
							<input
								autoFocus
								placeholder='Szűrd a szavakat'
								value={q}
								onChange={(e) => {
									setQ(e.target.value)
								}}
							/>
							{filter && (
								<button
									type='button'
									className='ccc_does_not_expand'
									onClick={() => {
										setQ('')
									}}
								>
									{CLOSE_CHARACTER}
								</button>
							)}
						</div>
						<WordsSortComp
							_sort={sort}
							_setSort={setSort}
							_language0Name={dictionary.current!.language0}
							_language1Name={dictionary.current!.language1}
						/>
						<LoadableComp _value={$wordCount} _load={loadWordCount}>
							{(wordCount) => (
								<>
									<LoadableComp _value={$words} _load={loadWords}>
										{(words) =>
											words.current == null || words.current.length === 0 ? (
												<p>
													<em>
														<IconComp _icon='🙈' /> Nem találtam egy szót sem.
													</em>
												</p>
											) : sort == null ||
											  [
													WordsByDictionaryIdSort.ModifiedDate0,
													WordsByDictionaryIdSort.ModifiedDate1,
											  ].includes(sort) ? (
												<WordListByDateComp
													_words={words.current}
													_firstIndex={pageSize * page}
													_selectedWordIds={$selectedWordIds}
													_setSelectedWordIds={set$selectedWordIds}
													_swapTranslations={[
														WordsByDictionaryIdSort.CountTranslation1,
														WordsByDictionaryIdSort.ModifiedDate1,
													].includes(sort)}
												/>
											) : (
												<WordListComp
													_words={words.current}
													_firstIndex={pageSize * page}
													_selectedWordIds={$selectedWordIds}
													_setSelectedWordIds={set$selectedWordIds}
													_swapTranslations={[
														WordsByDictionaryIdSort.CountTranslation1,
														WordsByDictionaryIdSort.ModifiedDate1,
													].includes(sort)}
												/>
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
						<div className='ccc_para'>
							<Link relative={'path'} to={`../word/`} role='button'>
								<IconComp _icon='➕' /> Adj hozzá egy szót
							</Link>
							<WordsMenuComp
								_dictionaryId={dictionary.current.id!}
								_selectedWordIds={$selectedWordIds}
								_setSelectedWordIds={set$selectedWordIds}
								_onDone={loadDictionary}
							/>
						</div>
					</div>
				)
			}
		</LoadableComp>
	)
}
