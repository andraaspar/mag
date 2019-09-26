export async function asyncFilter<T>(
	arr: T[],
	fn: (item: T, index: number, arr: T[]) => Promise<boolean>,
): Promise<T[]> {
	const flags = await Promise.all(
		arr.map((item, index, arr) => fn(item, index, arr)),
	)
	return arr.filter((item, index) => flags[index])
}
