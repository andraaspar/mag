import * as React from 'react'
import { useContext, useMemo, useState } from 'react'
import { dateToString } from '../function/dateToString'
import { sanitizeWord } from '../function/sanitizeWord'
import { useWordValidationErrors } from '../hook/useWordValidationErrors'
import { DEFAULT_COUNT } from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { Word } from '../model/Word'
import { checkForConflictingWord } from '../storage/checkForConflictingWord'
import { getDb, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { ErrorsComp } from './ErrorsComp'
import { ShowMessageContext } from './ShowMessageContext'

export interface EditWordCompProps {
	_dictionary: Dictionary
	_word: Word
	_onSuccess: () => void
}

export function EditWordComp({
	_dictionary,
	_word,
	_onSuccess,
}: EditWordCompProps) {
	const showMessage = useContext(ShowMessageContext)
	const [$translation0Text, set$translation0Text] = useState(
		_word.translation0.text,
	)
	const [$translation1Text, set$translation1Text] = useState(
		_word.translation1.text,
	)
	const [$translation0Description, set$translation0Description] = useState(
		_word.translation0.description,
	)
	const [$translation1Description, set$translation1Description] = useState(
		_word.translation1.description,
	)
	const word = useMemo(
		() =>
			sanitizeWord({
				...(_word.id && { id: _word.id }),
				dictionaryId: _dictionary.id!,
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
			}),
		[
			_dictionary,
			_word.id,
			$translation0Text,
			$translation0Description,
			$translation1Text,
			$translation1Description,
		],
	)
	const validationErrors = useWordValidationErrors(word)
	return (
		<>
			<h1>Adj hozzá egy szót</h1>
			<p>
				{_dictionary.language0}:{' '}
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
				{_dictionary.language1}:{' '}
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
							_onSuccess()
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
