export function sanitizeEnumValue<T>(
	e: { [k: number]: string },
	value: number,
): T {
	return ((value in e ? value : 0) as unknown) as T
}
