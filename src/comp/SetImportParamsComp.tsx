import * as React from 'react'
import { dictionaryToString } from '../function/dictionaryToString'
import { Dictionary } from '../model/Dictionary'
import { isLoaded, TLoadable } from '../model/TLoadable'
import { readDictionaries } from '../storage/readDictionaries'
import { ImportableDictionary, ImportParams } from './ImportFromFilePage'
import { LoadableComp } from './LoadableComp'

export interface SetImportParamsCompProps {
	_importableDictionary: ImportableDictionary
	_importParams: ImportParams
	_setImportParams: (v: ImportParams) => void
}

export function SetImportParamsComp({
	_importableDictionary,
	_importParams,
	_setImportParams,
}: SetImportParamsCompProps) {
	const [$dictionaries, set$dictionaries] = React.useState<
		TLoadable<Dictionary[]>
	>(null)
	const loadDictionaries = React.useCallback(() => {
		let isAborted = false
		;(async () => {
			const dictionaries = await readDictionaries({})
			if (isAborted) return
			set$dictionaries(dictionaries)
			if (!_importableDictionary.dictionary.id) {
				const dictionaryWithSameName = dictionaries.find(
					dictionary =>
						dictionary.name ===
						_importableDictionary.dictionary.name,
				)
				if (dictionaryWithSameName) {
					_setImportParams({
						dictionary: dictionaryWithSameName,
						swapLanguages: false,
					})
				}
			}
		})()
		return () => {
			isAborted = true
		}
	}, [_importableDictionary, _setImportParams])
	return (
		<>
			<p>
				Egyesítsd ezzel a szótárral:{' '}
				<LoadableComp _value={$dictionaries} _load={loadDictionaries}>
					{dictionaries => (
						<select
							value={_importParams.dictionary.id}
							onChange={e => {
								const id = e.currentTarget.value
									? parseInt(e.currentTarget.value, 10)
									: null
								const dictionary = isLoaded($dictionaries)
									? $dictionaries.find(
											dictionary => dictionary.id === id,
									  )
									: undefined
								_setImportParams({
									..._importParams,
									dictionary:
										dictionary ||
										_importableDictionary.dictionary,
								})
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
					)}
				</LoadableComp>
			</p>
		</>
	)
}
