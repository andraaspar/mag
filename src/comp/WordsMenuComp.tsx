import React, { useContext } from 'react'
import { useMemo } from 'use-memo-one'
import {
	CHECKBOX_CHARACTER,
	ERROR_CHARACTER,
	NO_QUESTIONS_CHARACTER,
	QUESTIONS_CHARACTER,
} from '../model/constants'
import { TSelection } from '../model/TSelection'
import { deleteWords } from '../storage/deleteWords'
import { toggleWords } from '../storage/toggleWords'
import { ShieldContext } from './ShieldContext'

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
	const { showShield, hideShield } = useContext(ShieldContext)
	return (
		<select
			value=''
			onChange={async e => {
				switch (e.target.value) {
					case BulkActions.Deselect:
						_setSelectedWordIds({})
						break
					case BulkActions.Disable:
						showShield('q0t1hz')
						await toggleWords({
							dictionaryId: _dictionaryId,
							wordIds: Object.keys(_selectedWordIds).map(_ => +_),
							enable: false,
						})
						hideShield('q0t1hz')
						_setSelectedWordIds({})
						_onDone()
						break
					case BulkActions.Enable:
						showShield('q0t1iw')
						await toggleWords({
							dictionaryId: _dictionaryId,
							wordIds: Object.keys(_selectedWordIds).map(_ => +_),
							enable: true,
						})
						hideShield('q0t1iw')
						_setSelectedWordIds({})
						_onDone()
						break
					case BulkActions.Delete:
						if (
							window.confirm(
								`Biztosan törölni akarod a kiválasztott szavakat?`,
							)
						) {
							showShield('q0t1je')
							await deleteWords({
								dictionaryId: _dictionaryId,
								wordIds: Object.keys(_selectedWordIds).map(
									_ => +_,
								),
							})
							hideShield('q0t1je')
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
				<option value={BulkActions.Deselect}>
					{CHECKBOX_CHARACTER} ne válaszd ki
				</option>
			)}
			<option value={BulkActions.Enable}>
				{QUESTIONS_CHARACTER} kapcsold be
			</option>
			<option value={BulkActions.Disable}>
				{NO_QUESTIONS_CHARACTER} kapcsold ki
			</option>
			{selectedWordsCount > 0 && (
				<option value={BulkActions.Delete}>
					{ERROR_CHARACTER} töröld
				</option>
			)}
		</select>
	)
}
