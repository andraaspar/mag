import { isLoaded, TLoadable } from '../model/TLoadable'

export function selectPageCount(o: {
	pageSize: number
	itemCount: TLoadable<{
		count: number
	}>
}) {
	return isLoaded(o.itemCount)
		? Math.max(1, Math.ceil(o.itemCount.count / o.pageSize))
		: 1
}
