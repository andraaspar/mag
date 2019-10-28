import * as React from 'react'
import { useContext, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { dateToString } from '../function/dateToString'
import { sanitizeWord } from '../function/sanitizeWord'
import { useDictionary } from '../hook/useDictionary'
import { useWordValidationErrors } from '../hook/useWordValidationErrors'
import { DEFAULT_COUNT } from '../model/constants'
import { isLoaded } from '../model/TLoadable'
import { checkForConflictingWord } from '../storage/checkForConflictingWord'
import { getDb, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { ErrorsComp } from './ErrorsComp'
import { LoadableComp } from './LoadableComp'
import { ShowMessageContext } from './ShowMessageContext'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface AddWordPageProps {}

export function AddWordPage(props: AddWordPageProps) {
	const routeMatch = useRouteMatch<{ dictionaryId: string; wordId: string }>(
		`/dictionary/:dictionaryId/word/`,
	)
	const showMessage = useContext(ShowMessageContext)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId, 10)
	const [$translation0Text, set$translation0Text] = useState('')
	const [$translation1Text, set$translation1Text] = useState('')
	const [$translation0Description, set$translation0Description] = useState('')
	const [$translation1Description, set$translation1Description] = useState('')
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const word = useMemo(() => {
		if (dictionaryId == null) {
			return null
		} else {
			return sanitizeWord({
				dictionaryId: dictionaryId,
				modifiedDate: dateToString(new Date()),
				translation0: {
					text: $translation0Text,
					description: $translation0Description,
					count: DEFAULT_COUNT,
				},
				translation1: {
					text: $translation1Text,
					description: $translation1Description,
					count: DEFAULT_COUNT,
				},
			})
		}
	}, [
		dictionaryId,
		$translation0Text,
		$translation0Description,
		$translation1Text,
		$translation1Description,
	])
	const validationErrors = useWordValidationErrors(word)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<>
						<h1>Adj hozzá egy szót</h1>
						<p>
							{dictionary.current.language0}:{' '}
							<input
								value={$translation0Text}
								onChange={e => {
									set$translation0Text(e.target.value)
								}}
							/>
						</p>
						<p>
							Magyarázat:{' '}
							<input
								value={$translation0Description}
								onChange={e => {
									set$translation0Description(e.target.value)
								}}
							/>
						</p>
						<p>
							{dictionary.current.language1}:{' '}
							<input
								value={$translation1Text}
								onChange={e => {
									set$translation1Text(e.target.value)
								}}
							/>
						</p>
						<p>
							Magyarázat:{' '}
							<input
								value={$translation1Description}
								onChange={e => {
									set$translation1Description(e.target.value)
								}}
							/>
						</p>
						<ErrorsComp _errors={validationErrors} />
						<p>
							<button
								type='button'
								disabled={
									!isLoaded(validationErrors) ||
									validationErrors.length > 0
								}
								onClick={async () => {
									if (!word) return
									const t = getDb().transaction(
										[STORE_WORDS],
										'readwrite',
									)
									try {
										await checkForConflictingWord({
											t,
											word: word,
										})
										await storeWord({
											t,
											word: word,
										})
										set$translation0Text('')
										set$translation0Description('')
										set$translation1Text('')
										set$translation1Description('')
									} catch (e) {
										showMessage(e)
									}
								}}
							>
								Tárold el
							</button>
						</p>
					</>
				)
			}
		</LoadableComp>
	)
}
