export interface ProgressCompProps {
	_progress: number
}

export function ProgressComp({ _progress }: ProgressCompProps) {
	return (
		<div className='ccc_progress_outer'>
			<div
				className='ccc_progress_inner'
				style={{ flexBasis: `${_progress * 100}%` }}
			/>
		</div>
	)
}
