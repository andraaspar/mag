import React from 'react'
import { Dictionary } from '../model/Dictionary'

export interface DictionaryCompProps {
	_dictionary: Dictionary
}

export function DictionaryComp({ _dictionary }: DictionaryCompProps) {
	return (
		<>
			{_dictionary.name} ({_dictionary.languages.join(', ')})
		</>
	)
}
