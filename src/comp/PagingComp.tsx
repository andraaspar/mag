import * as React from 'react'

export interface PagingCompProps {
	_page: number
	_setPage: (n: number) => void
	_pageCount: number
}

export function PagingComp({ _page, _pageCount, _setPage }: PagingCompProps) {
	return (
		<p>
			<button
				type='button'
				disabled={_page === 0}
				onClick={() => {
					_setPage(_page - 1)
				}}
			>
				«
			</button>{' '}
			<span>
				{_page + 1} / {_pageCount}
			</span>{' '}
			<button
				type='button'
				disabled={_page === _pageCount - 1}
				onClick={() => {
					_setPage(_page + 1)
				}}
			>
				»
			</button>
		</p>
	)
}
