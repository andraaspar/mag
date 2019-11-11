import React, { PropsWithChildren } from 'react'
import ReactFocusLock from 'react-focus-lock'
import { PROGRESS_CHARACTER } from '../model/constants'
import styles from './ShieldComp.module.css'

export interface ShieldCompProps {}

export function ShieldComp(props: PropsWithChildren<ShieldCompProps>) {
	return (
		<ReactFocusLock returnFocus>
			<div className={styles.shield} tabIndex={0}>
				{PROGRESS_CHARACTER}
			</div>
		</ReactFocusLock>
	)
}
