import React, { useState } from 'react'
import { useMemo } from 'use-memo-one'
import { sanitizeDictionary } from '../function/sanitizeDictionary'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { DictionaryPropsComp } from './DictionaryPropsComp'
import { ErrorsComp } from './ErrorsComp'

export interface EditDictionaryCompProps {
	_dictionary: Dictionary
	_storeDictionary: (d: Dictionary) => void
}

export function EditDictionaryComp({
	_dictionary,
	_storeDictionary,
}: EditDictionaryCompProps) {
	const [$dictionary, set$dictionary] = useState(_dictionary)
	const sanitizedDictionary = useMemo(() => sanitizeDictionary($dictionary), [
		$dictionary,
	])
	const dictionaryValidationErrors = useDictionaryValidationErrors(
		sanitizedDictionary,
	)
	const touched = !!(
		sanitizedDictionary.language0 ||
		sanitizedDictionary.language1 ||
		sanitizedDictionary.name
	)
	return (
		<form
			onSubmit={async e => {
				e.preventDefault()
				_storeDictionary(sanitizedDictionary)
			}}
		>
			<DictionaryPropsComp
				_dictionary={$dictionary}
				_setDictionary={set$dictionary}
			/>
			{touched && <ErrorsComp _errors={dictionaryValidationErrors} />}
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
