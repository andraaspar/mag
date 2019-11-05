export function avoidDuplicates<T>(
	a: readonly T[],
	equals: (a: T, b: T) => boolean,
): T[] {
	const result = a.slice()
	let count = result.length
	let lastItem: T | undefined = undefined
	for (let i = count - 1; i >= 0; i--) {
		const item = result[i]
		if (lastItem != null) {
			if (equals(lastItem, item)) {
				if (i > 0) {
					result.splice(i - 1, 0, ...result.splice(i, 1))
					i--
				} else {
					result.splice(i + 2, 0, ...result.splice(i, 1))
				}
			}
		}
		lastItem = item
	}
	if (result.length > 3 && equals(result[0], result[count - 1])) {
		result.splice(1, 0, ...result.splice(0, 1))
	}
	return result
}
