import * as React from 'react'
import { WordsByDictionaryIdSort } from '../storage/readWordsByDictionaryId'

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
	const sortByDate = [
		WordsByDictionaryIdSort.ModifiedDate0,
		WordsByDictionaryIdSort.ModifiedDate1,
	].includes(_sort)
	const sortByLanguage0 = [
		WordsByDictionaryIdSort.CountTranslation0,
		WordsByDictionaryIdSort.ModifiedDate0,
	].includes(_sort)
	return (
		<p>
			<button
				type='button'
				onClick={() => {
					_setSort(
						getSort({
							sortByDate,
							sortByLanguage0: !sortByLanguage0,
						}),
					)
				}}
			>
				{sortByLanguage0 ? _language0Name : _language1Name} A-Z
			</button>{' '}
			<label>
				<input
					type='checkbox'
					checked={sortByDate}
					onChange={e => {
						_setSort(
							getSort({
								sortByDate: e.target.checked,
								sortByLanguage0,
							}),
						)
					}}
				/>
				Dátum szerint
			</label>
		</p>
	)
}

function getSort({
	sortByDate,
	sortByLanguage0,
}: {
	sortByDate: boolean
	sortByLanguage0: boolean
}) {
	return sortByDate
		? sortByLanguage0
			? WordsByDictionaryIdSort.ModifiedDate0
			: WordsByDictionaryIdSort.ModifiedDate1
		: sortByLanguage0
		? WordsByDictionaryIdSort.CountTranslation0
		: WordsByDictionaryIdSort.CountTranslation1
}
