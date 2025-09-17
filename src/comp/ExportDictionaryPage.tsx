import { useMemo, useRef, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { dictionaryToString } from '../function/dictionaryToString'
import { url } from '../function/url'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useWordCountByDictionaryId } from '../hook/useWordCountByDictionaryId'
import { useWordsByDictionaryId } from '../hook/useWordsByDictionaryId'
import { ExportedDictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { ExportedWord } from '../model/Word'
import { DictionaryComp } from './DictionaryComp'
import { FocusRefComp } from './FocusRefComp'
import { IconComp } from './IconComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface ExportDictionaryPageProps {}

export function ExportDictionaryPage(props: ExportDictionaryPageProps) {
	const routeMatch = useMatch('/dictionary/:dictionaryId/export/')
	const dictionaryId = routeMatch?.params.dictionaryId
		? parseInt(routeMatch.params.dictionaryId, 10)
		: null
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const { $wordCount, loadWordCount } = useWordCountByDictionaryId({
		dictionaryId,
	})
	const [$page, set$page] = useState(0)
	const pageSize = 100000
	const { $words, loadWords } = useWordsByDictionaryId({
		dictionaryId,
		page: $page,
		pageSize: pageSize,
	})
	const pageCount = isLoaded($wordCount)
		? Math.max(1, Math.ceil($wordCount.current / pageSize))
		: 1
	const $json = useMemo(() => {
		if (
			!isLoaded($dictionary) ||
			!isLoaded($words) ||
			$dictionary.current == null ||
			$words.current == null
		) {
			return ''
		}
		const d: ExportedDictionary = {
			version: 1,
			name: $dictionary.current.name,
			language0: $dictionary.current.language0,
			language1: $dictionary.current.language1,
			categories0: $dictionary.current.categories0,
			categories1: $dictionary.current.categories1,
			words: $words.current.map(
				(w): ExportedWord => ({
					modifiedDate: w.modifiedDate,
					translation0: w.translation0,
					translation1: w.translation1,
				}),
			),
		}
		return JSON.stringify(d, undefined, '\t')
	}, [$words, $dictionary])
	usePageTitle(
		!isLoaded($dictionary)
			? `Szótár kimentése`
			: `${
					$dictionary.current
						? dictionaryToString($dictionary.current)
						: `Ismeretlen`
			  } szótár kimentése`,
	)
	const downloadLinkRef = useRef<HTMLAnchorElement>(null)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{(dictionary) =>
				dictionary.current ? (
					<div className='ccc_col ccc_gap_0_5'>
						<h1>
							<DictionaryComp _dictionary={dictionary.current} /> szótár
							kimentése
						</h1>
						<LoadableComp _value={$wordCount} _load={loadWordCount}>
							{(wordCount) => (
								<>
									<LoadableComp _value={$words} _load={loadWords}>
										{(words) => (
											<>
												<div className='ccc_para'>
													<textarea
														ref={textAreaRef}
														value={$json}
														readOnly
													></textarea>
												</div>
												<div className='ccc_para'>
													<button
														type='button'
														onClick={() => {
															if (textAreaRef.current) {
																textAreaRef.current.focus()
																textAreaRef.current.setSelectionRange(
																	0,
																	$json.length,
																)
																document.execCommand('copy')
															}
														}}
													>
														<IconComp _icon='📋' /> Másold
													</button>
													<a
														role='button'
														ref={downloadLinkRef}
														download={`${dictionaryToString(
															dictionary.current!,
														)}${pageCount > 1 ? `-${$page + 1}` : ''}.json`}
														href={url`data:text/json;charset=utf-8,${$json}`}
													>
														<IconComp _icon='💾' /> Tárold el
													</a>
													<FocusRefComp _focusThis={downloadLinkRef} />
												</div>
											</>
										)}
									</LoadableComp>
									{pageCount > 1 && (
										<PagingComp
											_page={$page}
											_setPage={set$page}
											_pageCount={pageCount}
										/>
									)}
								</>
							)}
						</LoadableComp>
					</div>
				) : (
					<UnknownDictionaryComp />
				)
			}
		</LoadableComp>
	)
}
