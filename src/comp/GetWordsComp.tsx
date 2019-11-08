import React, { useContext, useState } from 'react'
import { dictionaryFromAndroid } from '../function/dictionaryFromAndroid'
import { dictionaryFromExport } from '../function/dictionaryFromExport'
import { readJsonFromFile } from '../function/readJsonFromFile'
import { wordFromAndroid } from '../function/wordFromAndroid'
import { wordFromExport } from '../function/wordFromExport'
import { DictionaryFromAndroid, ExportedDictionary } from '../model/Dictionary'
import { ContentRowComp } from './ContentRowComp'
import { FormRowComp } from './FormRowComp'
import { ImportableDictionary } from './ImportFromFilePage'
import { LabelComp } from './LabelComp'
import { ShowMessageContext } from './ShowMessageContext'

export interface GetWordsCompProps {
	_setImportableDictionary: (v: ImportableDictionary) => void
}

export function GetWordsComp({ _setImportableDictionary }: GetWordsCompProps) {
	const [$json, set$json] = useState('')
	const showMessage = useContext(ShowMessageContext)
	return (
		<ContentRowComp>
			<FormRowComp>
				<LabelComp>Fájlból</LabelComp>
				<input
					autoFocus
					type='file'
					onChange={async e => {
						try {
							const files = e.target.files
							if (!files) return
							const file = files[0]
							if (!file) return
							const dictionary = await readJsonFromFile<
								DictionaryFromAndroid | ExportedDictionary
							>(file)
							if ('version' in dictionary) {
								_setImportableDictionary({
									dictionary: dictionaryFromExport(
										dictionary,
									),
									words: dictionary.words.map(wordFromExport),
								})
							} else {
								_setImportableDictionary({
									dictionary: dictionaryFromAndroid(
										dictionary,
									),
									words: dictionary.words.map(
										wordFromAndroid,
									),
								})
							}
						} catch (e) {
							showMessage(e)
						}
					}}
				/>
			</FormRowComp>
			<FormRowComp>
				<LabelComp>Vágólapról</LabelComp>
				<textarea
					placeholder={`Illeszd be ide...`}
					rows={1}
					cols={`Illeszd be ide...`.length}
					value={$json}
					onChange={e => {
						try {
							const json = e.currentTarget.value
							set$json(json)
							if (!json) return
							try {
								var dictionary:
									| DictionaryFromAndroid
									| ExportedDictionary = JSON.parse(json)
							} catch (e) {
								console.error(e)
								throw new Error(
									`[pyfjn5] Nem tudtam elolvasni amit beillesztettél: JSON hibát észleltem.`,
								)
							}
							try {
								if ('version' in dictionary) {
									_setImportableDictionary({
										dictionary: dictionaryFromExport(
											dictionary,
										),
										words: dictionary.words.map(
											wordFromExport,
										),
									})
								} else {
									_setImportableDictionary({
										dictionary: dictionaryFromAndroid(
											dictionary,
										),
										words: dictionary.words.map(
											wordFromAndroid,
										),
									})
								}
							} catch (e) {
								console.error(e)
								throw new Error(
									`[pyfjt9] Nem tudtam elolvasni amit beillesztettél: hibás volt a formátuma.`,
								)
							}
							set$json('')
						} catch (e) {
							showMessage(e)
						}
					}}
				></textarea>
			</FormRowComp>
		</ContentRowComp>
	)
}
