import { useCallback, useState } from 'react'

export function useMessages() {
	const [$messages, set$messages] = useState<readonly string[]>([])
	const showMessage = useCallback(
		(message: any) => {
			if (message instanceof Error) {
				console.error(message)
			} else {
				console.info(message)
			}
			const messageString = message + ''
			const lastMessage = $messages[$messages.length - 1]
			let lastMessageCount = 1
			const lastMessageStart = lastMessage
				? lastMessage.replace(/ \((\d+)\)$/, (match, count) => {
						lastMessageCount = parseInt(count, 10)
						return ''
				  })
				: undefined
			if (messageString === lastMessageStart) {
				set$messages([
					...$messages.slice(0, $messages.length - 1),
					messageString + ` (${lastMessageCount + 1})`,
				])
			} else {
				set$messages([...$messages, messageString])
			}
		},
		[$messages],
	)
	const removeMessageByIndex = useCallback(
		(index: number) => {
			set$messages([
				...$messages.slice(0, index),
				...$messages.slice(index + 1),
			])
		},
		[$messages],
	)
	return { messages: $messages, showMessage, removeMessageByIndex }
}
