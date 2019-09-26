import * as React from 'react'
import { ReactNode, useEffect, useRef } from 'react'
import {
	hasLoadError,
	isLoaded,
	isLoading,
	isNotLoaded,
	TLoadable,
} from '../model/TLoadable'

export interface LoadableCompProps<T> {
	_value: TLoadable<T>
	_load?: () => () => void
	_debugName?: string
	children: (value: T) => ReactNode
}

export function LoadableComp<T>({
	_value,
	_load,
	_debugName,
	children,
}: LoadableCompProps<T>) {
	const valueIsLoading = useRef(false)
	valueIsLoading.current = isLoading(_value)
	useEffect(() => {
		if (_load) {
			if (valueIsLoading.current) {
				console.warn(`[pyfh9t] Már töltöm: ${_debugName}`)
				return
			}
			return _load()
		}
	}, [_load, _debugName, valueIsLoading])
	return (
		<React.Fragment>
			{isLoaded(_value) && children(_value)}
			{(isNotLoaded(_value) || isLoading(_value)) && '⌚'}
			{hasLoadError(_value) && (
				<span style={{ color: `#bf0000` }}>{_value}</span>
			)}
		</React.Fragment>
	)
}
