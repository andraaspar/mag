import React, { PropsWithChildren } from 'react'
import styles from './LabelComp.module.css'

export interface LabelCompProps {
	_for?: string
	_required?: boolean
}

export function LabelComp({
	_for,
	_required,
	children,
}: PropsWithChildren<LabelCompProps>) {
	return (
		<label htmlFor={_for} className={styles.label}>
			{children}
			{_required && <span className={styles.required}>•</span>}:
		</label>
	)
}
