import * as React from 'react'
import { Link } from 'react-router-dom'

export interface UnknownDictionaryCompProps {}

export function UnknownDictionaryComp(props: UnknownDictionaryCompProps) {
	return (
		<>
			<h1>Ismeretlen szótár</h1>
			<p>
				Ez a szótár nem létezik.{' '}
				<Link to='/'>Menj vissza a kezdőoldalra</Link>, és válassz egy
				másikat!
			</p>
		</>
	)
}
