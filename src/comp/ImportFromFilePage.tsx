import * as React from 'react'
import { useCallback, useContext, useRef, useState } from 'react'
import { dictionaryFromAndroid } from '../function/dictionaryFromAndroid'
import { handleDictionaryImport } from '../function/handleDictionaryImport'
import { readJsonFromFile } from '../function/readJsonFromFile'
import { wordFromAndroid } from '../function/wordFromAndroid'
import { usePageTitle } from '../hook/usePageTitle'
import { Dictionary, DictionaryFromAndroid } from '../model/Dictionary'
import { TAbort } from '../model/TAbort'
import { Word } from '../model/Word'
import { readDictionaries } from '../storage/readDictionaries'
import { LoadableComp } from './LoadableComp'
import { ShowMessageContext } from './ShowMessageContext'

export interface ImportableDictionary {
	dictionary: Dictionary
	words: readonly Word[]
	dictionaries: Dictionary[] | null
}

export function ImportFromFilePage() {
	usePageTitle(`Tölts be szavakat`)
	const [
		$importableDictionary,
		set$importableDictionary,
	] = useState<ImportableDictionary | null>(null)
	const [$json, set$json] = useState('')
	const showMessage = useContext(ShowMessageContext)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const reset = useCallback(() => {
		set$json('')
		set$importableDictionary(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}, [])
	const loadDictionaries = useCallback(() => {
		let abort: TAbort = null
		;(async () => {
			if (!$importableDictionary) return
			let aborted = false
			abort = () => {
				aborted = true
			}
			const dictionaries = await readDictionaries({})
			if (aborted) return
			set$importableDictionary({
				...$importableDictionary,
				dictionaries,
			})
		})()
		return () => {
			if (abort) abort()
		}
	}, [$importableDictionary])
	return (
		<div>
			<h1>Tölts be szavakat</h1>
			<form
				onSubmit={async e => {
					e.preventDefault()
					try {
						if (!$importableDictionary) {
							throw new Error(`[pydz1i]`)
						}
						await handleDictionaryImport({
							dictionary: $importableDictionary.dictionary,
							words: $importableDictionary.words,
						})
						reset()
					} catch (e) {
						showMessage(e)
					}
				}}
			>
				{!$importableDictionary && (
					<>
						<p>
							Fájlból:{` `}
							<input
								type='file'
								ref={fileInputRef}
								onChange={async e => {
									try {
										const files = e.target.files
										if (!files) {
											reset()
											return
										}
										const file = files[0]
										if (!file) {
											reset()
											return
										}
										const dictionary = await readJsonFromFile<
											DictionaryFromAndroid
										>(file)
										set$importableDictionary({
											dictionary: dictionaryFromAndroid(
												dictionary,
											),
											words: dictionary.words.map(
												wordFromAndroid,
											),
											dictionaries: null,
										})
										if (fileInputRef.current) {
											fileInputRef.current.value = ''
										}
									} catch (e) {
										showMessage(e)
									}
								}}
							/>
						</p>
						<p>
							Vágólapról:{` `}
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
											var dictionary = JSON.parse(json)
										} catch (e) {
											console.error(e)
											throw new Error(
												`[pyfjn5] Nem tudtam elolvasni amit beillesztettél: JSON hibát észleltem.`,
											)
										}
										try {
											set$importableDictionary({
												dictionary: dictionaryFromAndroid(
													dictionary,
												),
												words: dictionary.words.map(
													wordFromAndroid,
												),
												dictionaries: null,
											})
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
						</p>
					</>
				)}
				{$importableDictionary && (
					<>
						<p>
							Egyesítsd ezzel a szótárral:{' '}
							<LoadableComp
								_value={$importableDictionary.dictionaries}
								_load={loadDictionaries}
							>
								{dictionaries => (
									<select
										value={
											$importableDictionary.dictionary.id
										}
										onChange={e => {
											const id = e.currentTarget.value
												? parseInt(
														e.currentTarget.value,
														10,
												  )
												: undefined
											set$importableDictionary({
												...$importableDictionary,
												dictionary: {
													...$importableDictionary.dictionary,
													id,
												},
											})
										}}
									>
										<option value={''}>Új szótár</option>
										{dictionaries.map(dictionary => (
											<option
												key={dictionary.id}
												value={dictionary.id}
											>
												{dictionary.name} (
												{dictionary.languages.join(
													', ',
												)}
												)
											</option>
										))}
									</select>
								)}
							</LoadableComp>
						</p>
						<p>
							<button>Tárold el</button>
							<button type='button' onClick={reset}>
								Mégse
							</button>
						</p>
					</>
				)}
			</form>
		</div>
	)
}
