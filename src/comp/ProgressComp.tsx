import React from 'react'
import styles from './ProgressComp.module.css'

export interface ProgressCompProps {
	_progress: number
}

export function ProgressComp({ _progress }: ProgressCompProps) {
	return (
		<div className={styles.outer}>
			<div
				className={styles.inner}
				style={{ flexBasis: `${_progress * 100}%` }}
			/>
		</div>
	)
}
