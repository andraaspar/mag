import React, { PropsWithChildren } from 'react'
import { RowComp } from './RowComp'

export interface FormRowCompProps {}

export function FormRowComp(props: PropsWithChildren<FormRowCompProps>) {
	return (
		<RowComp _gap={5} _fill>
			{props.children}
		</RowComp>
	)
}
