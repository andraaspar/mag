import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { ERROR_CHARACTER } from '../model/constants'

export function useMessages() {
	const [$messages, set$messages] = useState<readonly string[]>([])
	const showMessage = useCallback((message: any) => {
		if (message instanceof Error) {
			console.error(message)
		} else {
			console.info(message)
		}
		const messageString = (message + '').replace(
			/^Error:\s*/,
			ERROR_CHARACTER + ' ',
		)
		set$messages(messages => {
			const lastMessage = messages[messages.length - 1]
			let lastMessageCount = 1
			const lastMessageStart = lastMessage
				? lastMessage.replace(/ \((\d+)\)$/, (match, count) => {
						lastMessageCount = parseInt(count, 10)
						return ''
				  })
				: undefined
			if (messageString === lastMessageStart) {
				return [
					...messages.slice(0, messages.length - 1),
					messageString + ` (${lastMessageCount + 1})`,
				]
			} else {
				return [...messages, messageString]
			}
		})
	}, [])
	const removeMessageByIndex = useCallback((index: number) => {
		set$messages(messages => [
			...messages.slice(0, index),
			...messages.slice(index + 1),
		])
	}, [])
	return { messages: $messages, showMessage, removeMessageByIndex }
}
