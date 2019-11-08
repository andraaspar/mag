import React from 'react'
import { ButtonRowComp } from './ButtonRowComp'
import { LabelComp } from './LabelComp'

export interface PagingCompProps {
	_page: number
	_setPage: (n: number) => void
	_pageCount: number
}

export function PagingComp({ _page, _pageCount, _setPage }: PagingCompProps) {
	return (
		<ButtonRowComp>
			<button
				type='button'
				className='does-not-expand'
				disabled={_page === 0}
				onClick={() => {
					_setPage(_page - 1)
				}}
			>
				«
			</button>
			<LabelComp>
				{_page + 1} / {_pageCount}
			</LabelComp>
			<button
				type='button'
				className='does-not-expand'
				disabled={_page === _pageCount - 1}
				onClick={() => {
					_setPage(_page + 1)
				}}
			>
				»
			</button>
		</ButtonRowComp>
	)
}
