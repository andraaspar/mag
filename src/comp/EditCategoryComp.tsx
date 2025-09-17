import { Ref } from 'react'

export interface EditCategoryCompProps {
	_category: string
	_index: number
	_setCategories: (fn: (categories: string[]) => string[]) => void
	_focusRef: Ref<HTMLInputElement | null>
}

export function EditCategoryComp({
	_category,
	_index,
	_setCategories,
	_focusRef,
}: EditCategoryCompProps) {
	return (
		<div className='ccc_para'>
			<input
				ref={_focusRef}
				value={_category}
				onChange={(e) => {
					_setCategories((categories) => [
						...categories.slice(0, _index),
						e.target.value,
						...categories.slice(_index + 1),
					])
				}}
			/>
			<button
				type='button'
				onClick={() => {
					_setCategories((categories) => [
						...categories.slice(0, _index),
						...categories.slice(_index + 1),
					])
				}}
			>
				❌
			</button>
		</div>
	)
}
