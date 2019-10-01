import * as React from 'react'
import { TLoadable } from '../model/TLoadable'
import { LoadableComp } from './LoadableComp'

export interface DictionaryValidationErrorsCompProps {
	_errors: TLoadable<string[]>
}

export function DictionaryValidationErrorsComp({
	_errors,
}: DictionaryValidationErrorsCompProps) {
	return (
		<LoadableComp _value={_errors}>
			{dictionaryValidationErrors =>
				dictionaryValidationErrors.length > 0 && (
					<>
						<p>Hibák:</p>
						<ul>
							{dictionaryValidationErrors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</>
				)
			}
		</LoadableComp>
	)
}
