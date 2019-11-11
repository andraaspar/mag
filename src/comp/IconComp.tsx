import React from 'react'

export interface IconCompProps {
	_icon: string
}

export function IconComp(props: IconCompProps) {
	return (
		<span role='img' aria-label=''>
			{props._icon}
		</span>
	)
}
