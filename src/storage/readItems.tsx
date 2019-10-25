export interface ReadItemsSource<T> {
	getAll(key?: IDBKeyRange): Promise<T[]>
	openCursor(
		range?: IDBKeyRange,
		direction?: IDBCursorDirection,
	): Promise<ReadItemsCursor<T> | null>
}

export interface ReadItemsCursor<T> {
	value: T
	continue(): Promise<ReadItemsCursor<T> | null>
	advance(n: number): Promise<ReadItemsCursor<T> | null>
}

export interface ReadItemsParams<T> extends ReadItemsPagingParams<T> {
	source: ReadItemsSource<T>
}

export interface ReadItemsPagingParams<T> {
	pageSize?: number
	page?: number
	filter?: (item: T) => boolean
	range?: IDBKeyRange
	direction?: IDBCursorDirection
}

export async function readItems<T>({
	source,
	pageSize = Infinity,
	page = 0,
	filter,
	range,
	direction,
}: ReadItemsParams<T>): Promise<T[]> {
	if (!filter && !isFinite(pageSize) && !direction) {
		return source.getAll(range)
	}
	const result: T[] = []
	let cursor = await source.openCursor(range, direction)
	const firstItemIndex = page * pageSize
	if (cursor) {
		if (firstItemIndex) {
			if (filter) {
				let index = -1
				while (cursor) {
					if (filter(cursor.value) && ++index === firstItemIndex) {
						break
					}
					cursor = await cursor.continue()
				}
			} else {
				cursor = await cursor.advance(firstItemIndex)
			}
		}
		while (cursor && result.length < pageSize) {
			if (!filter || filter(cursor.value)) {
				result.push(cursor.value)
			}
			cursor = await cursor.continue()
		}
	}
	return result
}
