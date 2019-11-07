import React, { useEffect } from 'react'

export interface FocusRefCompProps<T extends HTMLElement> {
	_focusThis: React.RefObject<T | null | undefined>
}

export function FocusRefComp<T extends HTMLElement>({
	_focusThis,
}: FocusRefCompProps<T>) {
	useEffect(() => {
		if (_focusThis.current) {
			_focusThis.current.focus()
		}
	}, [_focusThis])
	return <></>
}
