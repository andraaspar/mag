import React, { PropsWithChildren } from 'react'
import { RowComp } from './RowComp'

export interface ContentRowCompProps {}

export function ContentRowComp(props: PropsWithChildren<ContentRowCompProps>) {
	return (
		<RowComp _isVertical _gap={10}>
			{props.children}
		</RowComp>
	)
}
