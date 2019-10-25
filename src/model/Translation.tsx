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

export function translationToDb(t: Translation): DbTranslation {
	return {
		text: t.text,
		count: t.count,
		description: t.description,
		textForSort: stringToIdbSortable(t.text),
		descriptionForSort: stringToIdbSortable(t.description),
		countForSort: t.count > 0 ? 0 : 1,
	}
}

export function translationFromDb(t: DbTranslation): Translation {
	return {
		text: t.text,
		count: t.count,
		description: t.description,
	}
}
