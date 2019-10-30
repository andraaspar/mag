import * as React from 'react'
import { getEnumValues } from '../function/getEnumValues'
import { WordsByDictionaryIdSort } from '../storage/readWordsByDictionaryId'

const SORT_LABELS = {
	[WordsByDictionaryIdSort.CountTranslation0]: `Rendezd az első nyelv szerint`,
	[WordsByDictionaryIdSort.CountTranslation1]: `Rendezd a második nyelv szerint`,
	[WordsByDictionaryIdSort.ModifiedDate0]: `Rendezd dátum, majd az első nyelv szerint`,
	[WordsByDictionaryIdSort.ModifiedDate1]: `Rendezd dátum, majd a második nyelv szerint`,
}

export interface WordsSortCompProps {
	_sort: WordsByDictionaryIdSort
	_setSort: (v: WordsByDictionaryIdSort) => void
	_language0Name: string
	_language1Name: string
}

export function WordsSortComp({
	_sort,
	_setSort,
	_language0Name,
	_language1Name,
}: WordsSortCompProps) {
	return (
		<p>
			<select
				value={_sort as number}
				onChange={e => {
					_setSort(parseInt(e.target.value, 10))
				}}
			>
				{getEnumValues(WordsByDictionaryIdSort).map(
					(value: WordsByDictionaryIdSort) => (
						<option key={value} value={value}>
							{(() => {
								switch (value) {
									case WordsByDictionaryIdSort.CountTranslation0:
										return `Rendezd „${_language0Name}” szerint`
									case WordsByDictionaryIdSort.CountTranslation1:
										return `Rendezd „${_language1Name}” szerint`
									case WordsByDictionaryIdSort.ModifiedDate0:
										return `Rendezd dátum, majd „${_language0Name}” szerint`
									case WordsByDictionaryIdSort.ModifiedDate1:
										return `Rendezd dátum, majd „${_language1Name}” szerint`
								}
							})()}
						</option>
					),
				)}
			</select>
		</p>
	)
}
