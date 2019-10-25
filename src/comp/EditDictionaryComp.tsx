import React from 'react'
import { Dictionary } from '../model/Dictionary'

export interface EditDictionaryCompProps {
	_dictionary: Dictionary
	_setDictionary: (v: Dictionary) => void
}

export function EditDictionaryComp({
	_dictionary,
	_setDictionary,
}: EditDictionaryCompProps) {
	return (
		<>
			<p>
				Név:{' '}
				<input
					value={_dictionary.name}
					onChange={e => {
						_setDictionary({ ..._dictionary, name: e.target.value })
					}}
				/>
			</p>
			<p>
				Első nyelv neve:{' '}
				<input
					value={_dictionary.language0}
					onChange={e => {
						_setDictionary({
							..._dictionary,
							language0: e.target.value,
						})
					}}
				/>
			</p>
			<p>
				Második nyelv neve:{' '}
				<input
					value={_dictionary.language1}
					onChange={e => {
						_setDictionary({
							..._dictionary,
							language1: e.target.value,
						})
					}}
				/>
			</p>
		</>
	)
}
