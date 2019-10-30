import { isNumber } from 'util'

export function sanitizePageIndex({
	page = 0,
	pageCount = 1,
}: {
	page: number
	pageCount?: number
}): number {
	if (!isNumber(page) || isNaN(page) || !isFinite(page)) {
		page = 0
	} else {
		page = Math.max(0, Math.min(pageCount - 1, page))
	}
	return page
}
