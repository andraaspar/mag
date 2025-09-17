import { useCallback, useRef } from 'react'
import { Dictionary } from '../model/Dictionary'
import { EditCategoryComp } from './EditCategoryComp'
import { RequiredComp } from './RequiredComp'

export interface DictionaryPropsCompProps {
	_dictionary: Dictionary
	_setDictionary: (v: Dictionary) => void
}

export function DictionaryPropsComp({
	_dictionary,
	_setDictionary,
}: DictionaryPropsCompProps) {
	const setCategories0 = useCallback(
		(fn: (tags: string[]) => string[]) => {
			_setDictionary({
				..._dictionary,
				categories0: fn(_dictionary.categories0 ?? []),
			})
		},
		[_setDictionary, _dictionary],
	)
	const setCategories1 = useCallback(
		(fn: (tags: string[]) => string[]) => {
			_setDictionary({
				..._dictionary,
				categories1: fn(_dictionary.categories1 ?? []),
			})
		},
		[_setDictionary, _dictionary],
	)

	const category0FocusRef = useRef<HTMLInputElement>(null)
	const category1FocusRef = useRef<HTMLInputElement>(null)

	return (
		<div className='ccc_col ccc_gap_0_5'>
			<div className='ccc_para'>
				<label>
					Név
					<RequiredComp />:
				</label>
				<input
					autoFocus
					value={_dictionary.name}
					onChange={(e) => {
						_setDictionary({ ..._dictionary, name: e.target.value })
					}}
				/>
			</div>
			<div className='ccc_para'>
				<label>
					Első nyelv neve
					<RequiredComp />:
				</label>
				<input
					value={_dictionary.language0}
					onChange={(e) => {
						_setDictionary({
							..._dictionary,
							language0: e.target.value,
						})
					}}
				/>
			</div>
			<div className='ccc_col ccc_gap_0_25'>
				<label>Kategóriák:</label>
				{(_dictionary.categories0 ?? []).map((tag, index) => (
					<EditCategoryComp
						_category={tag}
						_index={index}
						_setCategories={setCategories0}
						_focusRef={category0FocusRef}
					/>
				))}
				<button
					type='button'
					onClick={() => {
						setCategories0((it) => [...it, ''])
						requestAnimationFrame(() => {
							category0FocusRef.current?.focus()
						})
					}}
				>
					➕ Új kategória
				</button>
			</div>
			<div className='ccc_para'>
				<label>
					Második nyelv neve
					<RequiredComp />:
				</label>
				<input
					value={_dictionary.language1}
					onChange={(e) => {
						_setDictionary({
							..._dictionary,
							language1: e.target.value,
						})
					}}
				/>
			</div>
			<div className='ccc_col ccc_gap_0_25'>
				<label>Kategóriák:</label>
				{(_dictionary.categories1 ?? []).map((tag, index) => (
					<EditCategoryComp
						_category={tag}
						_index={index}
						_setCategories={setCategories1}
						_focusRef={category1FocusRef}
					/>
				))}
				<button
					type='button'
					onClick={() => {
						setCategories1((it) => [...it, ''])
						requestAnimationFrame(() => {
							category1FocusRef.current?.focus()
						})
					}}
				>
					➕ Új kategória
				</button>
			</div>
		</div>
	)
}
