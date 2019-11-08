import React, { PropsWithChildren } from 'react'
import { RowComp } from './RowComp'

export interface ButtonRowCompProps {}

export function ButtonRowComp(props: PropsWithChildren<ButtonRowCompProps>) {
	return (
		<RowComp _gap={5} _wrap>
			{props.children}
		</RowComp>
	)
}
