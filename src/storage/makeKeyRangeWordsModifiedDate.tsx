import { MIN_MAX_RANGE } from '../model/constants'
import { TKeyLimits } from '../model/TKeyLimits'

export function makeKeyRangeWordsModifiedDate(
	dictionaryId: number,
	modifiedDateForSort: TKeyLimits<string> = MIN_MAX_RANGE,
	countForSort: TKeyLimits<number> = MIN_MAX_RANGE,
	textForSort: TKeyLimits<string> = MIN_MAX_RANGE,
	descriptionForSort: TKeyLimits<string> = MIN_MAX_RANGE,
) {
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
