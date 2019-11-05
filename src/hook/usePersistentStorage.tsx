import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import { TLoadable } from '../model/TLoadable'

export function usePersistentStorage() {
	const [$isPersistentStorage, set$isPersistentStorage] = useState<
		TLoadable<{ current: boolean }>
	>(null)
	const loadPersistentStorage = useCallback(() => {
		let aborted = false
		;(async () => {
			try {
				if (!navigator.storage) {
					set$isPersistentStorage({ current: false })
				} else {
					set$isPersistentStorage(Date.now())
					const current = await navigator.storage.persisted()
					if (aborted) return
					set$isPersistentStorage({
						current,
					})
				}
			} catch (e) {
				if (aborted) return
				console.error(e)
				set$isPersistentStorage(e + '')
			}
		})()
		return () => {
			aborted = true
		}
	}, [])
	return {
		$isPersistentStorage,
		set$isPersistentStorage,
		loadPersistentStorage,
	}
}
