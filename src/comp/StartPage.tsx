import * as React from 'react'
import { useCallback, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { url } from '../function/url'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary } from '../model/Dictionary'
import { TLoadable } from '../model/TLoadable'
import { selectPageCount } from '../selector/selectPageCount'
import { countDictionaries } from '../storage/countDictionaries'
import { getDb, STORE_DICTIONARIES } from '../storage/Db'
import { readDictionaries } from '../storage/readDictionaries'
import { DictionaryComp } from './DictionaryComp'
import { LoadableComp } from './LoadableComp'
import { PagingComp } from './PagingComp'
import { ShowMessageContext } from './ShowMessageContext'

export function StartPage() {
	usePageTitle(`Szia!`)
	const [$pageSize] = useState(10)
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
		set$dictionaryCount(Date.now())
		set$dictionariesOnPage(Date.now())
		;(async () => {
			try {
				const t = getDb().transaction([STORE_DICTIONARIES], 'readonly')
				const [count, dictionaries] = await Promise.all([
					countDictionaries({ t }),
					readDictionaries({ t, pageSize: $pageSize, page: $page }),
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
				set$dictionariesOnPage(dictionaries)
			} catch (e) {
				if (isAborted) return
				showMessage(e)
				set$dictionaryCount(e + '')
				set$dictionariesOnPage(e + '')
			}
		})()
		return () => {
			isAborted = true
		}
	}, [$page, $pageSize, showMessage])
	const pageCount = selectPageCount({
		pageSize: $pageSize,
		itemCount: $dictionaryCount,
	})
	return (
		<div>
			<h1>Szia!</h1>
			<p>
				Mag vagyok, egy szógyakorló program. Magolj velem! Internet
				nélkül is működöm!
			</p>
			<LoadableComp
				_value={$dictionariesOnPage}
				_load={loadDictionariesOnPage}
			>
				{dictionaries => (
					<>
						{dictionaries.length > 0 && (
							<>
								<p>Válassz egy szótárat:</p>
								<ol start={$page * $pageSize + 1}>
									{dictionaries.map(dictionary => (
										<li key={dictionary.id}>
											<Link
												to={url`/dictionary/${dictionary.id!}`}
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
						)}
						<p>
							<Link to='/dictionary'>Új szótár</Link> •{' '}
							<Link to='/import'>Tölts be egy szótárat</Link>
						</p>
					</>
				)}
			</LoadableComp>
		</div>
	)
}
