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
			{_dictionary.languages.map((language, index, languages) => (
				<p key={index}>
					{index + 1}. nyelv neve:{' '}
					<input
						value={language}
						onChange={e => {
							_setDictionary({
								..._dictionary,
								languages: [
									...languages.slice(0, index),
									e.target.value,
									...languages.slice(index + 1),
								] as [string, string],
							})
						}}
					/>
				</p>
			))}
		</>
	)
}
