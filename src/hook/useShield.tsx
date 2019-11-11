import { useState } from 'react'
import { useMemo } from 'use-memo-one'
import { ShieldContextType } from '../comp/ShieldContext'
import { omit } from '../function/omit'
import { withInterface } from '../function/withInterface'

export function useShield() {
	const [$shieldKeys, set$shieldKeys] = useState<{ [k: string]: number }>({})
	const shieldContextValue = useMemo(
		() =>
			withInterface<ShieldContextType>({
				showShield: key => {
					set$shieldKeys(shieldKeys => {
						const result = {
							...shieldKeys,
							[key]: (shieldKeys[key] || 0) + 1,
						}
						// console.log(
						// 	`[q0t15i] Showing shield: ${key} → [${Object.keys(
						// 		shieldKeys,
						// 	).join(', ')}]`,
						// )
						return result
					})
				},
				hideShield: key => {
					set$shieldKeys(shieldKeys => {
						let result: typeof shieldKeys
						if (shieldKeys[key] > 1) {
							result = {
								...shieldKeys,
								[key]: shieldKeys[key] - 1,
							}
						} else {
							result = omit(shieldKeys, key)
						}
						// console.log(
						// 	`[q0t161] Hiding shield: ${key} → [${Object.keys(
						// 		shieldKeys,
						// 	).join(', ')}]`,
						// )
						return result
					})
				},
			}),
		[],
	)
	return { $shieldKeys, shieldContextValue }
}
