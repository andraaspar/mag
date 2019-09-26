import * as React from 'react'
import { usePageTitle } from '../hook/usePageTitle'

export function NotFoundPage() {
	usePageTitle(`Ez meg hol van?`)
	return (
		<>
			<h1>Ez meg hol van?</h1>
			<p>Há’ nem t’om hová menté’, mer’ ez nem az.</p>
		</>
	)
}
