export interface ReadItemsSource<T> {
	count(key?: IDBKeyRange): Promise<number>
	openCursor(range?: IDBKeyRange): Promise<ReadItemsCursor<T> | null>
}

export interface ReadItemsCursor<T> {
	value: T
	continue(): Promise<ReadItemsCursor<T> | null>
}

export interface CountItemsParams<T> extends CountItemsPagingParams<T> {
	source: ReadItemsSource<T>
}

export interface CountItemsPagingParams<T> {
	filter?: (item: T) => boolean
	range?: IDBKeyRange
}

export async function countItems<T>({
	source,
	filter,
	range,
}: CountItemsParams<T>): Promise<number> {
	if (!filter) {
		return source.count(range)
	}
	let result: number = 0
	let cursor = await source.openCursor(range)
	if (cursor) {
		while (cursor) {
			if (filter(cursor.value)) {
				result++
			}
			cursor = await cursor.continue()
		}
	}
	return result
}
