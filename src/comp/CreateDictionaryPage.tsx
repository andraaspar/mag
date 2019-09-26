import * as React from 'react'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { url } from '../function/url'
import { useDictionaryValidationErrors } from '../hook/useDictionaryValidationErrors'
import { Dictionary } from '../model/Dictionary'
import { isLoaded } from '../model/TLoadable'
import { storeDictionary } from '../storage/storeDictionary'
import { EditDictionaryComp } from './EditDictionaryComp'
import { LoadableComp } from './LoadableComp'

export function CreateDictionaryPage() {
	const [$dictionary, set$dictionary] = useState<Dictionary>({
		name: '',
		languages: ['', ''],
	})
	const dictionaryValidationErrors = useDictionaryValidationErrors(
		$dictionary,
	)
	const history = useHistory()
	return (
		<form
			onSubmit={async e => {
				e.preventDefault()
				const dictionaryId = await storeDictionary({
					dictionary: $dictionary,
				})
				history.push(url`/dictionary/${dictionaryId}`)
			}}
		>
			<EditDictionaryComp
				_dictionary={$dictionary}
				_setDictionary={set$dictionary}
			/>
			<LoadableComp _value={dictionaryValidationErrors}>
				{dictionaryValidationErrors =>
					dictionaryValidationErrors.length > 0 && (
						<>
							<p>Hibák:</p>
							<ul>
								{dictionaryValidationErrors.map(
									(error, index) => (
										<li key={index}>{error}</li>
									),
								)}
							</ul>
						</>
					)
				}
			</LoadableComp>
			<p>
				<button
					disabled={
						!isLoaded(dictionaryValidationErrors) ||
						dictionaryValidationErrors.length > 0
					}
				>
					Mentsd le
				</button>{' '}
				• <Link to='/'>Mégse</Link>
			</p>
		</form>
	)
}
