import React from 'react'
import { useMemo } from 'use-memo-one'
import { TSelection } from '../model/TSelection'
import { deleteWords } from '../storage/deleteWords'
import { toggleWords } from '../storage/toggleWords'

enum BulkActions {
	Enable = 'Enable',
	Disable = 'Disable',
	Deselect = 'Deselect',
	Delete = 'Delete',
}

export interface WordsMenuCompProps {
	_dictionaryId: number
	_selectedWordIds: TSelection
	_setSelectedWordIds: (v: TSelection) => void
	_onDone: () => void
}

export function WordsMenuComp({
	_selectedWordIds,
	_setSelectedWordIds,
	_dictionaryId,
	_onDone,
}: WordsMenuCompProps) {
	const selectedWordsCount = useMemo(
		() => Object.keys(_selectedWordIds).length,
		[_selectedWordIds],
	)
	return (
		<select
			value=''
			onChange={async e => {
				switch (e.target.value) {
					case BulkActions.Deselect:
						_setSelectedWordIds({})
						break
					case BulkActions.Disable:
						await toggleWords({
							dictionaryId: _dictionaryId,
							wordIds: Object.keys(_selectedWordIds).map(_ => +_),
							enable: false,
						})
						_setSelectedWordIds({})
						_onDone()
						break
					case BulkActions.Enable:
						await toggleWords({
							dictionaryId: _dictionaryId,
							wordIds: Object.keys(_selectedWordIds).map(_ => +_),
							enable: true,
						})
						_setSelectedWordIds({})
						_onDone()
						break
					case BulkActions.Delete:
						if (
							window.confirm(
								`Biztosan törölni akarod a kiválasztott szavakat?`,
							)
						) {
							await deleteWords({
								dictionaryId: _dictionaryId,
								wordIds: Object.keys(_selectedWordIds).map(
									_ => +_,
								),
							})
							_setSelectedWordIds({})
							_onDone()
						}
						break
				}
			}}
		>
			<option value=''>
				{selectedWordsCount
					? `A kiválasztott szavakat...`
					: `Az összes szót...`}
			</option>
			{selectedWordsCount > 0 && (
				<option value={BulkActions.Deselect}>ne válaszd ki</option>
			)}
			<option value={BulkActions.Enable}>kapcsold be</option>
			<option value={BulkActions.Disable}>kapcsold ki</option>
			{selectedWordsCount > 0 && (
				<option value={BulkActions.Delete}>töröld</option>
			)}
		</select>
	)
}
