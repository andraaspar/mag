import React from 'react'
import { useCallback } from 'use-memo-one'
import { dictionaryToString } from '../function/dictionaryToString'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { readDictionaries } from '../storage/readDictionaries'
import { DictionaryPropsComp } from './DictionaryPropsComp'
import { ImportableDictionary, ImportParams } from './ImportFromFilePage'
import { LoadableComp } from './LoadableComp'

export interface SetImportParamsCompProps {
	_importableDictionary: ImportableDictionary
	_importParams: ImportParams
	_setImportParams: (
		cb: (v: ImportParams | null) => ImportParams | null,
	) => void
	_dictionaryId: number | null
}

export function SetImportParamsComp({
	_importableDictionary,
	_importParams,
	_setImportParams,
	_dictionaryId,
}: SetImportParamsCompProps) {
	const [$dictionaries, set$dictionaries] = React.useState<
		TLoadable<Dictionary[]>
	>(null)
	const loadDictionaries = useCallback(() => {
		let isAborted = false
		;(async () => {
			set$dictionaries(Date.now())
			const dictionaries = await readDictionaries({})
			if (isAborted) return
			set$dictionaries(dictionaries)
			if (_dictionaryId) {
				const dictionaryById = dictionaries.find(
					dictionary => dictionary.id === _dictionaryId,
				)
				if (dictionaryById) {
					_setImportParams(importParams => ({
						dictionary: dictionaryById,
						swapLanguages: false,
					}))
				}
			} else if (!_importableDictionary.dictionary.id) {
				const dictionaryWithSameName = dictionaries.find(
					dictionary =>
						dictionary.name ===
						_importableDictionary.dictionary.name,
				)
				if (dictionaryWithSameName) {
					_setImportParams(importParams => ({
						dictionary: dictionaryWithSameName,
						swapLanguages: false,
					}))
				}
			}
		})()
		return () => {
			isAborted = true
		}
	}, [_importableDictionary, _setImportParams, _dictionaryId])
	const setDictionary = useCallback(
		(dictionary: Dictionary) => {
			_setImportParams(importParams => ({
				...importParams!,
				dictionary,
			}))
		},
		[_setImportParams],
	)
	return (
		<>
			<LoadableComp _value={$dictionaries} _load={loadDictionaries}>
				{dictionaries => (
					<>
						<p>
							Egyesítsd ezzel a szótárral:{' '}
							<select
								value={_importParams.dictionary.id}
								onChange={e => {
									const id = e.currentTarget.value
										? parseInt(e.currentTarget.value, 10)
										: null
									const dictionary = isLoaded($dictionaries)
										? $dictionaries.find(
												dictionary =>
													dictionary.id === id,
										  )
										: undefined
									_setImportParams(importParams => ({
										...importParams!,
										dictionary:
											dictionary ||
											_importableDictionary.dictionary,
										swapLanguages: false,
									}))
								}}
							>
								<option value={''}>Új szótár</option>
								{dictionaries.map(dictionary => (
									<option
										key={dictionary.id}
										value={dictionary.id}
									>
										{dictionaryToString(dictionary)}
									</option>
								))}
							</select>
						</p>
						<DictionaryPropsComp
							_dictionary={_importParams.dictionary}
							_setDictionary={setDictionary}
						/>
						<p>
							Nyelvsorrend:{' '}
							<select
								value={_importParams.swapLanguages + ''}
								onChange={e => {
									const swapLanguages = JSON.parse(
										e.target.value,
									)
									_setImportParams(importParams => ({
										...importParams!,
										swapLanguages,
									}))
								}}
							>
								<option value='false'>
									{_importableDictionary.dictionary.language0}{' '}
									→ {_importParams.dictionary.language0} és{' '}
									{_importableDictionary.dictionary.language1}{' '}
									→ {_importParams.dictionary.language1}
								</option>
								<option value='true'>
									{_importableDictionary.dictionary.language0}{' '}
									→ {_importParams.dictionary.language1} és{' '}
									{_importableDictionary.dictionary.language1}{' '}
									→ {_importParams.dictionary.language0}
								</option>
							</select>
						</p>
					</>
				)}
			</LoadableComp>
		</>
	)
}
