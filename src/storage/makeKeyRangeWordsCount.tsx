import { MAX_KEY, MIN_KEY } from '../model/constants'

export function makeKeyRangeWordsCount({
	dictionaryId,
	countForSort,
}: {
	dictionaryId: number
	countForSort?: number
}) {
	return IDBKeyRange.bound(
		[dictionaryId, countForSort == null ? MIN_KEY : countForSort],
		[dictionaryId, countForSort == null ? MAX_KEY : countForSort],
	)
}
