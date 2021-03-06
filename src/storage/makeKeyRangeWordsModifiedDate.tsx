import { MIN_MAX_RANGE } from '../model/constants'
import { TKeyLimits } from '../model/TKeyLimits'

export function makeKeyRangeWordsModifiedDate({
	dictionaryId,
	modifiedDateForSort = MIN_MAX_RANGE,
	countForSort = MIN_MAX_RANGE,
	textForSort = MIN_MAX_RANGE,
	descriptionForSort = MIN_MAX_RANGE,
}: {
	dictionaryId: number
	modifiedDateForSort?: TKeyLimits<string>
	countForSort?: TKeyLimits<number>
	textForSort?: TKeyLimits<string>
	descriptionForSort?: TKeyLimits<string>
}) {
	return IDBKeyRange.bound(
		[
			dictionaryId,
			modifiedDateForSort[0],
			countForSort[0],
			textForSort[0],
			descriptionForSort[0],
		],
		[
			dictionaryId,
			modifiedDateForSort[1],
			countForSort[1],
			textForSort[1],
			descriptionForSort[1],
		],
	)
}
