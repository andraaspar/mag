import React from 'react'
import { ERROR_CHARACTER } from '../model/constants'
import { TLoadable } from '../model/TLoadable'
import { Word } from '../model/Word'
import { ExistingTranslationError } from '../storage/checkForConflictingWord'
import { LoadableComp } from './LoadableComp'
import { WordComp } from './WordComp'

export interface ErrorsCompProps {
	_errors: TLoadable<Error[]>
}

export function ErrorsComp({ _errors }: ErrorsCompProps) {
	return (
		<LoadableComp _value={_errors}>
			{errors =>
				errors.length > 0 && (
					<>
						<p>Hibák:</p>
						<ul>
							{errors.map((error, index) => (
								<li key={index}>
									{error instanceof
									ExistingTranslationError ? (
										<>
											{ERROR_CHARACTER} Már létező
											fordítás:{' '}
											{(error.translations.filter(
												Boolean,
											) as Word[]).map(
												(translation, index) => (
													<WordComp
														key={index}
														_word={translation}
													/>
												),
											)}
										</>
									) : (
										`${ERROR_CHARACTER} ${error.message}`
									)}
								</li>
							))}
						</ul>
					</>
				)
			}
		</LoadableComp>
	)
}
