export interface PagingCompProps {
	_page: number
	_setPage: (n: number) => void
	_pageCount: number
}

export function PagingComp({ _page, _pageCount, _setPage }: PagingCompProps) {
	return (
		<div className='ccc_para'>
			<button
				type='button'
				className='ccc_does_not_expand'
				disabled={_page === 0}
				onClick={() => {
					_setPage(_page - 1)
				}}
			>
				«
			</button>
			<div className='ccc_button_padding_y'>
				{_page + 1} / {_pageCount}
			</div>
			<button
				type='button'
				className='ccc_does_not_expand'
				disabled={_page === _pageCount - 1}
				onClick={() => {
					_setPage(_page + 1)
				}}
			>
				»
			</button>
		</div>
	)
}
