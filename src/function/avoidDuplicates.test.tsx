import { equal, notEqual } from 'node:assert/strict'
import { it } from 'node:test'
import { avoidDuplicates } from './avoidDuplicates'

export function equals(a: number, b: number) {
	return a === b
}

it(`[q0icmo]`, () => {
	equal(avoidDuplicates([0, 0, 1], equals), [0, 1, 0])
})

it(`[q0id5i]`, () => {
	equal(avoidDuplicates([1, 0, 0], equals), [0, 1, 0])
})

it(`[q0idlk]`, () => {
	const result = avoidDuplicates([0, 1, 2, 0], equals)
	console.log(result)
	notEqual(result[0], result[3])
	equal(result.length, 4)
	equal(result.filter((n) => n != null).length, 4)
	equal(result.filter((n) => n !== 0).length, 2)
	equal(result.includes(1), true)
	equal(result.includes(2), true)
})
