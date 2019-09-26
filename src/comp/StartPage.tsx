import * as React from 'react'
import { usePageTitle } from '../hook/usePageTitle'

export function StartPage() {
	usePageTitle(`Szia!`)
	return (
		<div>
			<h1>Szia!</h1>
			<p>Mag vagyok, egy szógyakorló program. Magolj velem!</p>
			<p>És internet nélkül is működöm!</p>
		</div>
	)
}
