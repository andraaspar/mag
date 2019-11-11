import React from 'react'
import { CLOSE_CHARACTER } from '../model/constants'
import styles from './MessagesComp.module.css'

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
				<div key={index} className={styles.message}>
					<div className={styles.content}>{message}</div>
					<button
						type='button'
						className={styles.button}
						onClick={() => {
							_removeMessageByIndex(index)
						}}
					>
						{CLOSE_CHARACTER}
					</button>
				</div>
			))}
		</>
	)
}
