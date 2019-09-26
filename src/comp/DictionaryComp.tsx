import React from 'react'
import { dictionaryToString } from '../function/dictionaryToString'
import { Dictionary } from '../model/Dictionary'

export interface DictionaryCompProps {
	_dictionary: Dictionary
}

export function DictionaryComp({ _dictionary }: DictionaryCompProps) {
	return <>{dictionaryToString(_dictionary)}</>
}
