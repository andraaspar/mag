import { FormEvent, useCallback, useContext, useMemo, useState } from 'react'
import { dateToString } from '../function/dateToString'
import { sanitizeWord } from '../function/sanitizeWord'
import { useWordValidationErrors } from '../hook/useWordValidationErrors'
import {
	DEFAULT_COUNT,
	NO_QUESTIONS_CHARACTER,
	QUESTIONS_CHARACTER,
	SUCCESS_CHARACTER,
} from '../model/constants'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { Word } from '../model/Word'
import { checkForConflictingWord } from '../storage/checkForConflictingWord'
import { getDb, STORE_DICTIONARIES, STORE_WORDS } from '../storage/Db'
import { storeWord } from '../storage/storeWord'
import { updateDictionaryCount } from '../storage/updateDictionaryCount'
import { ErrorsComp } from './ErrorsComp'
import { IconComp } from './IconComp'
import { RequiredComp } from './RequiredComp'
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
			const t = getDb().transaction(
				[STORE_DICTIONARIES, STORE_WORDS],
				'readwrite',
			)
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
				await updateDictionaryCount({
					t,
					dictionaryId: sanitizedWord.dictionaryId,
				})
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
			<div className='ccc_col ccc_gap_0_5'>
				<h1>{_word.id ? `Módosítsd a szót` : `Adj hozzá egy szót`}</h1>
				<div className='ccc_para'>
					<label>
						{_dictionary.language0}
						<RequiredComp />:
					</label>
					<input
						autoFocus
						value={$translation0Text}
						onChange={(e) => {
							set$translation0Text(e.target.value)
						}}
					/>
				</div>
				<div className='ccc_para'>
					<label>Magyarázat:</label>
					<input
						value={$translation0Description}
						onChange={(e) => {
							set$translation0Description(e.target.value)
						}}
					/>
				</div>
				<div className='ccc_para'>
					<label>
						{_dictionary.language1}
						<RequiredComp />:
					</label>
					<input
						value={$translation1Text}
						onChange={(e) => {
							set$translation1Text(e.target.value)
						}}
					/>
				</div>
				<div className='ccc_para'>
					<label>Magyarázat:</label>
					<input
						value={$translation1Description}
						onChange={(e) => {
							set$translation1Description(e.target.value)
						}}
					/>
				</div>
				{_word.id && (
					<div className='ccc_para'>
						<small>
							Kérdések: {_word.translation0.count > 0 && QUESTIONS_CHARACTER}{' '}
							{_word.translation0.count} /{' '}
							{_word.translation1.count > 0 && QUESTIONS_CHARACTER}{' '}
							{_word.translation1.count}
						</small>
					</div>
				)}
				{touched && <ErrorsComp _errors={validationErrors} />}
				<div className='ccc_para'>
					<button
						disabled={
							!isLoaded(validationErrors) || validationErrors.length > 0
						}
					>
						<IconComp _icon={SUCCESS_CHARACTER} /> Tárold el
					</button>
					{_word.id &&
						(_word.translation0.count === 0 ||
							_word.translation1.count === 0) && (
							<button
								type='button'
								onClick={async () => {
									try {
										const t = getDb().transaction(
											[STORE_DICTIONARIES, STORE_WORDS],
											'readwrite',
										)
										await storeWord({
											t,
											word: {
												..._word,
												translation0: {
													..._word.translation0,
													count: _word.translation0.count || DEFAULT_COUNT,
												},
												translation1: {
													..._word.translation1,
													count: _word.translation1.count || DEFAULT_COUNT,
												},
											},
										})
										await updateDictionaryCount({
											t,
											dictionaryId: _word.dictionaryId,
										})
										_refresh()
									} catch (e) {
										showMessage(e)
									}
								}}
							>
								<IconComp _icon={QUESTIONS_CHARACTER} /> Kapcsold be a szót
							</button>
						)}
					{_word.id &&
						(_word.translation0.count > 0 || _word.translation1.count > 0) && (
							<button
								type='button'
								onClick={async () => {
									try {
										const t = getDb().transaction(
											[STORE_DICTIONARIES, STORE_WORDS],
											'readwrite',
										)
										await storeWord({
											t,
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
										await updateDictionaryCount({
											t,
											dictionaryId: _word.dictionaryId,
										})
										_refresh()
									} catch (e) {
										showMessage(e)
									}
								}}
							>
								<IconComp _icon={NO_QUESTIONS_CHARACTER} /> Kapcsold ki a szót
							</button>
						)}
				</div>
			</div>
		</form>
	)
}
