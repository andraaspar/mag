import React from 'react'
import styles from './SpacerComp.module.css'

export interface SpacerCompProps {}

export function SpacerComp(props: SpacerCompProps) {
	return <div className={styles.spacer} />
}
