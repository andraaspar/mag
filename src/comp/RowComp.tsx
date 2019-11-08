import React, { PropsWithChildren } from 'react'
import styles from './RowComp.module.css'

export interface RowCompProps {
	_isVertical?: boolean
	_gap?: 0 | 1 | 5 | 10 | 20
	_padding?: 0 | 1 | 5 | 10 | 20
	_fill?: boolean
	_wrap?: boolean
}

export function RowComp({
	children,
	_isVertical,
	_gap,
	_padding,
	_fill,
	_wrap,
}: PropsWithChildren<RowCompProps>) {
	return (
		<div
			className={[
				styles.wrapper,
				_isVertical ? styles.columnWrapper : styles.rowWrapper,
				_fill && styles.wrapperFill,
				_padding ? styles[`padding${_padding}`] : styles.padding0,
			]
				.filter(Boolean)
				.join(' ')}
		>
			<div
				className={[
					_isVertical ? styles.column : styles.row,
					_fill && styles.fill,
					_wrap && styles.wrap,
					_gap ? styles[`gap${_gap}`] : styles.gap0,
				]
					.filter(Boolean)
					.join(' ')}
			>
				{children}
			</div>
		</div>
	)
}
