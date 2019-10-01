export function nullToUndefined<T>(o: T | null): T | undefined {
	return o == null ? undefined : o
}
