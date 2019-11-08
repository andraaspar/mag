import React from 'react'
import { Dictionary } from '../model/Dictionary'
import { ContentRowComp } from './ContentRowComp'
import { FormRowComp } from './FormRowComp'
import { LabelComp } from './LabelComp'

export interface DictionaryPropsCompProps {
	_dictionary: Dictionary
	_setDictionary: (v: Dictionary) => void
}

export function DictionaryPropsComp({
	_dictionary,
	_setDictionary,
}: DictionaryPropsCompProps) {
	return (
		<ContentRowComp>
			<FormRowComp>
				<LabelComp _required>Név</LabelComp>
				<input
					autoFocus
					value={_dictionary.name}
					onChange={e => {
						_setDictionary({ ..._dictionary, name: e.target.value })
					}}
				/>
			</FormRowComp>
			<FormRowComp>
				<LabelComp _required>Első nyelv neve</LabelComp>
				<input
					value={_dictionary.language0}
					onChange={e => {
						_setDictionary({
							..._dictionary,
							language0: e.target.value,
						})
					}}
				/>
			</FormRowComp>
			<FormRowComp>
				<LabelComp _required>Második nyelv neve</LabelComp>
				<input
					value={_dictionary.language1}
					onChange={e => {
						_setDictionary({
							..._dictionary,
							language1: e.target.value,
						})
					}}
				/>
			</FormRowComp>
		</ContentRowComp>
	)
}
