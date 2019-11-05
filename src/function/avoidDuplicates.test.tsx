import { avoidDuplicates } from './avoidDuplicates'

export function equals(a: number, b: number) {
	return a === b
}

it(`[q0icmo]`, () => {
	expect(avoidDuplicates([0, 0, 1], equals)).toEqual([0, 1, 0])
})

it(`[q0id5i]`, () => {
	expect(avoidDuplicates([1, 0, 0], equals)).toEqual([0, 1, 0])
})

it(`[q0idlk]`, () => {
	const result = avoidDuplicates([0, 1, 2, 0], equals)
	console.log(result)
	expect(result[0]).not.toBe(result[3])
	expect(result.length).toBe(4)
	expect(result.filter(n => n != null).length).toBe(4)
	expect(result.filter(n => n !== 0).length).toBe(2)
	expect(result.includes(1)).toBe(true)
	expect(result.includes(2)).toBe(true)
})
