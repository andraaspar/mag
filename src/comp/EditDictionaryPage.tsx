import React, { useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useCallback } from 'use-memo-one'
import { dictionaryToString } from '../function/dictionaryToString'
import { url } from '../function/url'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { storeDictionary } from '../storage/storeDictionary'
import { ContentRowComp } from './ContentRowComp'
import { DictionaryComp } from './DictionaryComp'
import { EditDictionaryComp } from './EditDictionaryComp'
import { LoadableComp } from './LoadableComp'
import { ShieldContext } from './ShieldContext'

export function EditDictionaryPage() {
	const routeMatch = useRouteMatch<{ dictionaryId: string | undefined }>(
		`/dictionary/:dictionaryId/edit/`,
	)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId + '', 10)
	const history = useHistory()
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const { showShield, hideShield } = useContext(ShieldContext)
	const finish = useCallback(
		async (dictionary: Dictionary) => {
			showShield('q0t143')
			const storedDictionaryId = await storeDictionary({
				dictionary,
			})
			hideShield('q0t143')
			if (dictionaryId === storedDictionaryId) {
				history.goBack()
			} else {
				history.replace(url`/dictionary/${storedDictionaryId}/`)
			}
		},
		[history, dictionaryId, showShield, hideShield],
	)
	usePageTitle(
		isLoaded($dictionary) && $dictionary.current
			? `${dictionaryToString($dictionary.current)} módosítása`
			: `Új szótár`,
	)
	return (
		<>
			<LoadableComp _value={$dictionary} _load={loadDictionary}>
				{dictionary => (
					<ContentRowComp>
						<h1>
							{dictionary.current ? (
								<>
									<DictionaryComp
										_dictionary={dictionary.current}
									/>{' '}
									módosítása
								</>
							) : (
								`Új szótár`
							)}
						</h1>
						<EditDictionaryComp
							_dictionary={
								dictionary.current || {
									name: '',
									language0: '',
									language1: '',
									count: 0,
								}
							}
							_storeDictionary={finish}
						/>
					</ContentRowComp>
				)}
			</LoadableComp>
		</>
	)
}
