import * as React from 'react'
import { useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { sanitizeDictionary } from '../function/sanitizeDictionary'
import { url } from '../function/url'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { storeDictionary } from '../storage/storeDictionary'
import { DictionaryValidationErrorsComp } from './DictionaryValidationErrorsComp'
import { EditDictionaryComp } from './EditDictionaryComp'

export function CreateDictionaryPage() {
	usePageTitle(`Új szótár`)
	const [$dictionary, set$dictionary] = useState<Dictionary>({
		name: '',
		languages: ['', ''],
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
				history.push(url`/dictionary/${dictionaryId}`)
			}}
		>
			<h1>Új szótár</h1>
			<EditDictionaryComp
				_dictionary={$dictionary}
				_setDictionary={set$dictionary}
			/>
			<DictionaryValidationErrorsComp
				_errors={dictionaryValidationErrors}
			/>
			<p>
				<button
					disabled={
						!isLoaded(dictionaryValidationErrors) ||
						dictionaryValidationErrors.length > 0
					}
				>
					Mentsd le
				</button>{' '}
				• <Link to='/'>Mégse</Link>
			</p>
		</form>
	)
}
