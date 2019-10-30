import { MIN_MAX_RANGE } from '../model/constants'
import { TKeyLimits } from '../model/TKeyLimits'

export function makeKeyRangeWordsCount({
	dictionaryId,
	countForSort = MIN_MAX_RANGE,
}: {
	dictionaryId: number
	countForSort?: TKeyLimits<number>
}) {
	return IDBKeyRange.bound(
		[dictionaryId, countForSort[0]],
		[dictionaryId, countForSort[1]],
	)
}
