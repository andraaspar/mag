import React from 'react'
import { TLoadable } from '../model/TLoadable'
import { LoadableComp } from './LoadableComp'

export interface ErrorsCompProps {
	_errors: TLoadable<string[]>
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
								<li key={index}>{error}</li>
							))}
						</ul>
					</>
				)
			}
		</LoadableComp>
	)
}
