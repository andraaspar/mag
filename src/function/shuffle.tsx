export function shuffle<T>(a: readonly T[]): T[] {
	const result: T[] = []
	for (const item of a) {
		const newIndex = Math.floor(Math.random() * (result.length + 1))
		result.splice(newIndex, 0, item)
	}
	return result
}
