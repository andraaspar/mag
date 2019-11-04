import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useCallback } from 'use-memo-one'
import { dateToString } from '../function/dateToString'
import { useDictionary } from '../hook/useDictionary'
import { usePageTitle } from '../hook/usePageTitle'
import { useWord } from '../hook/useWord'
import { DEFAULT_COUNT } from '../model/constants'
import { isLoaded } from '../model/TLoadable'
import { EditWordComp } from './EditWordComp'
import { LoadableComp } from './LoadableComp'
import { UnknownDictionaryComp } from './UnknownDictionaryComp'

export interface EditWordPageProps {}

export function EditWordPage(props: EditWordPageProps) {
	const history = useHistory()
	const routeMatch = useRouteMatch<{
		dictionaryId: string
		wordId: string | undefined
	}>(`/dictionary/:dictionaryId/word/:wordId?/`)
	const dictionaryId =
		routeMatch && parseInt(routeMatch.params.dictionaryId, 10)
	const wordId =
		routeMatch && routeMatch.params.wordId != null
			? parseInt(routeMatch.params.wordId, 10)
			: null
	const { $dictionary, loadDictionary } = useDictionary(dictionaryId)
	const { $word, loadWord } = useWord(wordId)
	const onSuccess = useCallback(() => {
		if (isLoaded($word) && $word.current) {
			history.goBack()
		} else {
			loadDictionary()
		}
	}, [$word, history, loadDictionary])
	usePageTitle(
		!isLoaded($word)
			? `Szó`
			: $word.current
			? `Módosítsd a szót`
			: `Adj hozzá egy szót`,
	)
	return (
		<LoadableComp _value={$dictionary} _load={loadDictionary}>
			{dictionary =>
				dictionary.current == null ? (
					<UnknownDictionaryComp />
				) : (
					<LoadableComp _value={$word} _load={loadWord}>
						{word => (
							<EditWordComp
								_dictionary={dictionary.current!}
								_word={
									word.current || {
										dictionaryId: dictionary.current!.id!,
										modifiedDate: dateToString(new Date()),
										translation0: {
											text: '',
											description: '',
											count: DEFAULT_COUNT,
										},
										translation1: {
											text: '',
											description: '',
											count: DEFAULT_COUNT,
										},
									}
								}
								_onSuccess={onSuccess}
								_refresh={loadDictionary}
							/>
						)}
					</LoadableComp>
				)
			}
		</LoadableComp>
	)
}
