import * as React from 'react'

export interface MessagesCompProps {
	_messages: readonly string[]
	_removeMessageByIndex: (index: number) => void
}

export function MessagesComp({
	_messages,
	_removeMessageByIndex,
}: MessagesCompProps) {
	return (
		<>
			{_messages.map((message, index) => (
				<div key={index}>
					{message}{' '}
					<button
						type='button'
						onClick={() => {
							_removeMessageByIndex(index)
						}}
					>
						×
					</button>
				</div>
			))}
		</>
	)
}