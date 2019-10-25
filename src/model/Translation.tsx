import { stringToIdbSortable } from '../function/stringToIdbSortable'

export interface Translation {
	text: string
	description: string
	count: number
}

export interface DbTranslation extends Translation {
	textForSort: string
	descriptionForSort: string
	countForSort: number
}

export function makeDbTranslation(t: Translation): DbTranslation {
	return {
		...t,
		textForSort: stringToIdbSortable(t.text),
		descriptionForSort: stringToIdbSortable(t.description),
		countForSort: t.count > 0 ? 0 : 1,
	}
}
