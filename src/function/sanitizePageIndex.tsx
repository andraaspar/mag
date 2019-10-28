import { isNumber } from 'util'

export function sanitizePageIndex({
	page = 0,
	pageCount = 0,
}: {
	page: number
	pageCount?: number
}): number {
	if (!isNumber(page) || isNaN(page) || !isFinite(page)) {
		page = 0
	} else {
		if (page >= pageCount) {
			page = pageCount - 1
		}
		page = Math.max(0, page)
	}
	return page
}
