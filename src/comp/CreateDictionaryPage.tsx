import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMemo } from 'use-memo-one'
import { sanitizeDictionary } from '../function/sanitizeDictionary'
import { url } from '../function/url'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { storeDictionary } from '../storage/storeDictionary'
import { EditDictionaryComp } from './EditDictionaryComp'
import { ErrorsComp } from './ErrorsComp'

export function CreateDictionaryPage() {
	usePageTitle(`Új szótár`)
	const [$dictionary, set$dictionary] = useState<Dictionary>({
		name: '',
		language0: '',
		language1: '',
	})
	const sanitizedDictionary = useMemo(() => sanitizeDictionary($dictionary), [
		$dictionary,
	])
	const dictionaryValidationErrors = useDictionaryValidationErrors(
		sanitizedDictionary,
	)
	const history = useHistory()
	return (
		<form
			onSubmit={async e => {
				e.preventDefault()
				const dictionaryId = await storeDictionary({
					dictionary: sanitizedDictionary,
				})
				history.replace(url`/dictionary/${dictionaryId}/`)
			}}
		>
			<h1>Új szótár</h1>
			<EditDictionaryComp
				_dictionary={$dictionary}
				_setDictionary={set$dictionary}
			/>
			<ErrorsComp _errors={dictionaryValidationErrors} />
			<p>
				<button
					disabled={
						!isLoaded(dictionaryValidationErrors) ||
						dictionaryValidationErrors.length > 0
					}
				>
					Mentsd le
				</button>
			</p>
		</form>
	)
}
