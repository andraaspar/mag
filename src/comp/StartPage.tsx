import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCallback } from 'use-memo-one'
import { dictionaryToString } from '../function/dictionaryToString'
import { queryToRegExp } from '../function/queryToRegExp'
import { url } from '../function/url'
import { usePageTitle } from '../hook/usePageTitle'
import { CLOSE_CHARACTER } from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { selectPageCount } from '../selector/selectPageCount'
import { countDictionaries } from '../storage/countDictionaries'
import { getDb, STORE_DICTIONARIES } from '../storage/Db'
import { readDictionaries } from '../storage/readDictionaries'
import { ButtonRowComp } from './ButtonRowComp'
import { ContentRowComp } from './ContentRowComp'
import { DictionaryComp } from './DictionaryComp'
import { FocusRefComp } from './FocusRefComp'
import { FormRowComp } from './FormRowComp'
import { IconComp } from './IconComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { ShowMessageContext } from './ShowMessageContext'

export interface StartPageProps {}

export function StartPage(props: StartPageProps) {
	usePageTitle(`Szia!`)
	const [$pageSize] = useState(10)
	const [$query, set$query] = useState('')
	const [$totalDictionaryCount, set$totalDictionaryCount] = useState<
		TLoadable<{ count: number }>
	>(null)
	const [$dictionaryCount, set$dictionaryCount] = useState<
		TLoadable<{ count: number }>
	>(null)
	const [$page, set$page] = useState(0)
	const [$dictionariesOnPage, set$dictionariesOnPage] = useState<
		TLoadable<Dictionary[]>
	>(null)
	const showMessage = useContext(ShowMessageContext)
	const loadDictionariesOnPage = useCallback(() => {
		let isAborted = false
		// set$dictionaryCount(Date.now())
		// set$totalDictionaryCount(Date.now())
		set$dictionariesOnPage(Date.now())
		;(async () => {
			try {
				const t = getDb().transaction([STORE_DICTIONARIES], 'readonly')
				const filter = $query
					? (() => {
							const queryRe = queryToRegExp($query)
							return (d: Dictionary) =>
								queryRe.test(dictionaryToString(d))
					  })()
					: undefined
				const [totalCount, count, dictionaries] = await Promise.all([
					countDictionaries({ t }),
					countDictionaries({ t, filter }),
					readDictionaries({
						t,
						pageSize: $pageSize,
						page: $page,
						filter,
					}),
				])
				if (isAborted) return
				set$page(
					Math.min(
						$page,
						selectPageCount({
							pageSize: $pageSize,
							itemCount: count,
						}),
					),
				)
				set$dictionaryCount({ count })
				set$totalDictionaryCount({ count: totalCount })
				set$dictionariesOnPage(dictionaries)
			} catch (e) {
				if (isAborted) return
				showMessage(e)
				set$dictionaryCount(e + '')
				set$totalDictionaryCount(e + '')
				set$dictionariesOnPage(e + '')
			}
		})()
		return () => {
			isAborted = true
		}
	}, [$query, $page, $pageSize, showMessage])
	const pageCount = selectPageCount({
		pageSize: $pageSize,
		itemCount: $dictionaryCount,
	})
	const makeADictionaryLinkRef = useRef<HTMLAnchorElement>(null)
	return (
		<ContentRowComp>
			<h1>Szia!</h1>
			<p>Mag vagyok, egy szógyakorló program. Magolj velem!</p>
			{isLoaded($totalDictionaryCount) &&
				$totalDictionaryCount.count > 0 && (
					<FormRowComp>
						<input
							autoFocus
							placeholder='Szűrd a szótárakat'
							value={$query}
							onChange={e => {
								set$query(e.target.value)
							}}
						/>
						{$query && (
							<button
								type='button'
								className='does-not-expand'
								onClick={() => {
									set$query('')
								}}
							>
								{CLOSE_CHARACTER}
							</button>
						)}
					</FormRowComp>
				)}
			<LoadableComp
				_value={$dictionariesOnPage}
				_load={loadDictionariesOnPage}
			>
				{dictionaries => (
					<>
						{dictionaries.length > 0 ? (
							<>
								<p>Válassz egy szótárat:</p>
								<ol start={$page * $pageSize + 1}>
									{dictionaries.map(dictionary => (
										<li key={dictionary.id}>
											<Link
												to={url`/dictionary/${dictionary.id!}/`}
											>
												<DictionaryComp
													_dictionary={dictionary}
												/>
											</Link>
										</li>
									))}
								</ol>
								{pageCount > 1 && (
									<PagingComp
										_page={$page}
										_setPage={set$page}
										_pageCount={pageCount}
									/>
								)}
							</>
						) : (
							isLoaded($totalDictionaryCount) &&
							$totalDictionaryCount.count > 0 && (
								<p>
									<em>
										<IconComp _icon='🙈' /> Nem találtam egy
										szótárat sem.
									</em>
								</p>
							)
						)}
						{isLoaded($totalDictionaryCount) &&
						$totalDictionaryCount.count === 0 ? (
							<p>
								Először{' '}
								<Link
									to='/dictionary/'
									innerRef={makeADictionaryLinkRef}
								>
									<IconComp _icon='✨' /> készíts egy új
									szótárat
								</Link>
								<FocusRefComp
									_focusThis={makeADictionaryLinkRef}
								/>
								, vagy{' '}
								<Link to='/import/'>
									<IconComp _icon='📂' /> tölts be egy
									szótárat!
								</Link>
							</p>
						) : (
							<ButtonRowComp>
								<Link to='/dictionary/' role='button'>
									<IconComp _icon='✨' /> Készíts új szótárat
								</Link>{' '}
								<Link to='/import/' role='button'>
									<IconComp _icon='📂' /> Tölts be egy
									szótárat
								</Link>
							</ButtonRowComp>
						)}
					</>
				)}
			</LoadableComp>
		</ContentRowComp>
	)
}
