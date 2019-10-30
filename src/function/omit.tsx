export function omit<T, K extends keyof T>(o: T, keyToOmit: K): Omit<T, K> {
	const result = { ...o }
	delete result[keyToOmit]
	return result
}
