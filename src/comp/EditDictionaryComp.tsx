import { useMemo, useState } from 'react'
import { sanitizeDictionary } from '../function/sanitizeDictionary'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { SUCCESS_CHARACTER } from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { DictionaryPropsComp } from './DictionaryPropsComp'
import { ErrorsComp } from './ErrorsComp'
import { IconComp } from './IconComp'

export interface EditDictionaryCompProps {
	_dictionary: Dictionary
	_storeDictionary: (d: Dictionary) => void
}

export function EditDictionaryComp({
	_dictionary,
	_storeDictionary,
}: EditDictionaryCompProps) {
	const [$dictionary, set$dictionary] = useState(_dictionary)
	const sanitizedDictionary = useMemo(
		() => sanitizeDictionary($dictionary),
		[$dictionary],
	)
	const dictionaryValidationErrors =
		useDictionaryValidationErrors(sanitizedDictionary)
	const touched = !!(
		sanitizedDictionary.language0 ||
		sanitizedDictionary.language1 ||
		sanitizedDictionary.name
	)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				_storeDictionary(sanitizedDictionary)
			}}
		>
			<div className='ccc_col ccc_gap_0_5'>
				<DictionaryPropsComp
					_dictionary={$dictionary}
					_setDictionary={set$dictionary}
				/>
				{touched && <ErrorsComp _errors={dictionaryValidationErrors} />}
				<div className='ccc_para'>
					<button
						disabled={
							!isLoaded(dictionaryValidationErrors) ||
							dictionaryValidationErrors.length > 0
						}
					>
						<IconComp _icon={SUCCESS_CHARACTER} /> Tárold el
					</button>
				</div>
			</div>
		</form>
	)
}
