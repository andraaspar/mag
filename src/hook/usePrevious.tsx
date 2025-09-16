import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>(value)
	useEffect(() => {
		ref.current = value
	})
	return ref.current
}
