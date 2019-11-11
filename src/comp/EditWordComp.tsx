import React, { FormEvent, useContext, useState } from 'react'
import { useCallback, useMemo } from 'use-memo-one'
import { dateToString } from '../function/dateToString'
import { sanitizeWord } from '../function/sanitizeWord'
import { useWordValidationErrors } from '../hook/useWordValidationErrors'
import { DEFAULT_COUNT, QUESTIONS_CHARACTER } from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { Word } from '../model/Word'
import { checkForConflictingWord } from '../storage/checkForConflictingWord'
import { getDb, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { ButtonRowComp } from './ButtonRowComp'
import { ContentRowComp } from './ContentRowComp'
import { ErrorsComp } from './ErrorsComp'
import { FormRowComp } from './FormRowComp'
import { LabelComp } from './LabelComp'
import { ShieldContext } from './ShieldContext'
import { ShowMessageContext } from './ShowMessageContext'

export interface EditWordCompProps {
	_dictionary: Dictionary
	_word: Word
	_refresh: () => void
	_onSuccess: () => void
}

export function EditWordComp({
	_dictionary,
	_word,
	_refresh,
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
	const touched = !!(
		$translation0Text ||
		$translation1Text ||
		$translation0Description ||
		$translation1Description
	)
	const sanitizedWord = useMemo(
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
	const validationErrors = useWordValidationErrors(sanitizedWord)
	const { showShield, hideShield } = useContext(ShieldContext)
	const onSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault()
			if (!sanitizedWord) return
			const t = getDb().transaction([STORE_WORDS], 'readwrite')
			showShield('q0t1ec')
			try {
				await checkForConflictingWord({
					t,
					word: sanitizedWord,
				})
				await storeWord({
					t,
					word: sanitizedWord,
				})
				showMessage(`Eltároltam a szót.`)
				_onSuccess()
			} catch (e) {
				showMessage(e)
			}
			hideShield('q0t1ec')
		},
		[sanitizedWord, _onSuccess, showMessage, showShield, hideShield],
	)
	return (
		<form onSubmit={onSubmit}>
			<ContentRowComp>
				<h1>{_word.id ? `Módosítsd a szót` : `Adj hozzá egy szót`}</h1>
				<FormRowComp>
					<LabelComp _required>{_dictionary.language0}</LabelComp>
					<input
						autoFocus
						value={$translation0Text}
						onChange={e => {
							set$translation0Text(e.target.value)
						}}
					/>
				</FormRowComp>
				<FormRowComp>
					<LabelComp>Magyarázat</LabelComp>
					<input
						value={$translation0Description}
						onChange={e => {
							set$translation0Description(e.target.value)
						}}
					/>
				</FormRowComp>
				<FormRowComp>
					<LabelComp _required>{_dictionary.language1}</LabelComp>
					<input
						value={$translation1Text}
						onChange={e => {
							set$translation1Text(e.target.value)
						}}
					/>
				</FormRowComp>
				<FormRowComp>
					<LabelComp>Magyarázat</LabelComp>
					<input
						value={$translation1Description}
						onChange={e => {
							set$translation1Description(e.target.value)
						}}
					/>
				</FormRowComp>
				{_word.id && (
					<FormRowComp>
						<small>
							Kérdések:{' '}
							{_word.translation0.count > 0 &&
								QUESTIONS_CHARACTER}{' '}
							{_word.translation0.count} /{' '}
							{_word.translation1.count > 0 &&
								QUESTIONS_CHARACTER}{' '}
							{_word.translation1.count}
						</small>
					</FormRowComp>
				)}
				{touched && <ErrorsComp _errors={validationErrors} />}
				<ButtonRowComp>
					<button
						disabled={
							!isLoaded(validationErrors) ||
							validationErrors.length > 0
						}
					>
						Tárold el
					</button>
					{_word.id &&
						(_word.translation0.count === 0 ||
							_word.translation1.count === 0) && (
							<button
								type='button'
								onClick={async () => {
									try {
										await storeWord({
											word: {
												..._word,
												translation0: {
													..._word.translation0,
													count:
														_word.translation0
															.count ||
														DEFAULT_COUNT,
												},
												translation1: {
													..._word.translation1,
													count:
														_word.translation1
															.count ||
														DEFAULT_COUNT,
												},
											},
										})
										_refresh()
									} catch (e) {
										showMessage(e)
									}
								}}
							>
								Kapcsold be a szót
							</button>
						)}
					{_word.id &&
						(_word.translation0.count > 0 ||
							_word.translation1.count > 0) && (
							<button
								type='button'
								onClick={async () => {
									try {
										await storeWord({
											word: {
												..._word,
												translation0: {
													..._word.translation0,
													count: 0,
												},
												translation1: {
													..._word.translation1,
													count: 0,
												},
											},
										})
										_refresh()
									} catch (e) {
										showMessage(e)
									}
								}}
							>
								Kapcsold ki a szót
							</button>
						)}
				</ButtonRowComp>
			</ContentRowComp>
		</form>
	)
}
