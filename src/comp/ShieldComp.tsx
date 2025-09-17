import { PropsWithChildren, useEffect, useRef } from 'react'
import { PROGRESS_CHARACTER } from '../model/constants'

export interface ShieldCompProps {}

export function ShieldComp(props: PropsWithChildren<ShieldCompProps>) {
	const ref = useRef<HTMLDialogElement>(null)
	useEffect(() => {
		ref.current?.showModal()
	})
	return (
		<dialog className='ccc_layer' ref={ref}>
			<div className='ccc_shield'>{PROGRESS_CHARACTER}</div>
		</dialog>
	)
}
