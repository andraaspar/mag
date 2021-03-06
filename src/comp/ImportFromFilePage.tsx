import React, { useContext, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useCallback } from 'use-memo-one'
import { handleDictionaryImport } from '../function/handleDictionaryImport'
import { url } from '../function/url'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { usePageTitle } from '../hook/usePageTitle'
import { SUCCESS_CHARACTER } from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { Word } from '../model/Word'
import { ButtonRowComp } from './ButtonRowComp'
import { ContentRowComp } from './ContentRowComp'
import { ErrorsComp } from './ErrorsComp'
import { GetWordsComp } from './GetWordsComp'
import { IconComp } from './IconComp'
import { SetImportParamsComp } from './SetImportParamsComp'
import { ShieldContext } from './ShieldContext'
import { ShowMessageContext } from './ShowMessageContext'

export interface ImportableDictionary {
	dictionary: Dictionary
	words: readonly Word[]
}

export interface ImportParams {
	dictionary: Dictionary
	swapLanguages: boolean
}

export function ImportFromFilePage() {
	usePageTitle(`Tölts be szavakat`)
	const routeMatch = useRouteMatch<{ dictionaryId: string | undefined }>(
		`/dictionary/:dictionaryId/import/`,
	)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId + '', 10)
	const history = useHistory()
	const [
		$importableDictionary,
		set$importableDictionary,
	] = useState<ImportableDictionary | null>(null)
	const [$importParams, set$importParams] = useState<ImportParams | null>(
		null,
	)
	const dictionaryValidationErrors = useDictionaryValidationErrors(
		$importParams && $importParams.dictionary,
	)
	const showMessage = useContext(ShowMessageContext)
	const setImportableDictionary = useCallback((v: ImportableDictionary) => {
		set$importableDictionary(v)
		set$importParams({
			dictionary: v.dictionary,
			swapLanguages: false,
		})
	}, [])
	const { showShield, hideShield } = useContext(ShieldContext)
	return (
		<ContentRowComp>
			<h1>Tölts be szavakat</h1>
			<form
				onSubmit={async e => {
					e.preventDefault()
					showShield('q0t0z5')
					try {
						if (!$importableDictionary || !$importParams) {
							throw new Error(`[pydz1i]`)
						}
						const words = $importParams.swapLanguages
							? $importableDictionary.words.map(word => ({
									...word,
									translation0: word.translation1,
									translation1: word.translation0,
							  }))
							: $importableDictionary.words
						const storedDictionaryId = await handleDictionaryImport(
							{
								dictionary: $importParams.dictionary,
								words,
							},
						)
						if (storedDictionaryId === dictionaryId) {
							history.goBack()
						} else {
							history.replace(
								url`/dictionary/${storedDictionaryId}/`,
							)
						}
					} catch (e) {
						showMessage(e)
					}
					hideShield('q0t0z5')
				}}
			>
				<ContentRowComp>
					{!$importableDictionary && (
						<GetWordsComp
							_setImportableDictionary={setImportableDictionary}
						/>
					)}
					{$importableDictionary && $importParams && (
						<SetImportParamsComp
							_importableDictionary={$importableDictionary}
							_importParams={$importParams}
							_setImportParams={set$importParams}
							_dictionaryId={dictionaryId}
						/>
					)}
					<ErrorsComp _errors={dictionaryValidationErrors} />
					{$importableDictionary && (
						<ButtonRowComp>
							<button
								disabled={
									!isLoaded(dictionaryValidationErrors) ||
									dictionaryValidationErrors.length > 0
								}
							>
								<IconComp _icon={SUCCESS_CHARACTER} /> Tárold el
							</button>
						</ButtonRowComp>
					)}
				</ContentRowComp>
			</form>
		</ContentRowComp>
	)
}
