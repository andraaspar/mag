import React, { ReactNode, useEffect, useRef } from 'react'
import { usePrevious } from '../hook/usePrevious'
import { PROGRESS_CHARACTER } from '../model/constants'
import {
	hasLoadError,
	hasNotStartedLoading,
	isLoaded,
	isLoading,
	TLoadable,
} from '../model/TLoadable'

export interface LoadableCompProps<T extends object> {
	_value: TLoadable<T>
	_load?: () => (() => void) | void
	_debugName?: string
	children: (value: T) => ReactNode
}

export function LoadableComp<T extends object>({
	_value,
	_load,
	_debugName,
	children,
}: LoadableCompProps<T>) {
	const previousLoad = usePrevious(_load)
	const loadChanged = _load !== previousLoad
	const valueIsLoadingAt = useRef(0)
	const hadNotStartedLoading = useRef(false)
	const valueNeedsLoadingAt =
		_load &&
		(loadChanged ||
			(!hadNotStartedLoading.current && hasNotStartedLoading(_value)))
			? Date.now()
			: valueIsLoadingAt.current
	if (hadNotStartedLoading.current && hasNotStartedLoading(_value)) {
		console.warn(`[pyfh9t] Már töltöm: ${_debugName}`)
	}
	hadNotStartedLoading.current = hasNotStartedLoading(_value)
	useEffect(() => {
		if (_load) {
			valueIsLoadingAt.current = valueNeedsLoadingAt
			return _load()
		}
	}, [_load, _debugName, valueNeedsLoadingAt, valueIsLoadingAt])
	return (
		<React.Fragment>
			{!loadChanged && isLoaded(_value) && children(_value)}
			{(loadChanged ||
				hasNotStartedLoading(_value) ||
				isLoading(_value)) &&
				PROGRESS_CHARACTER}
			{hasLoadError(_value) && (
				<span style={{ color: `#bf0000` }}>{_value}</span>
			)}
		</React.Fragment>
	)
}
