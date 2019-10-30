import { MIN_MAX_RANGE } from '../model/constants'
import { TKeyLimits } from '../model/TKeyLimits'

export function makeKeyRangeWordsCountTranslation({
	dictionaryId,
	countForSort = MIN_MAX_RANGE,
	textForSort = MIN_MAX_RANGE,
	descriptionForSort = MIN_MAX_RANGE,
}: {
	dictionaryId: number
	countForSort?: TKeyLimits<number>
	textForSort?: TKeyLimits<string>
	descriptionForSort?: TKeyLimits<string>
}) {
	return IDBKeyRange.bound(
		[dictionaryId, countForSort[0], textForSort[0], descriptionForSort[0]],
		[dictionaryId, countForSort[1], textForSort[1], descriptionForSort[1]],
	)
}
