import { isNumber } from 'util'

let map: Map<string, number> | null = null
let firstNonLetterIndex = 0

function createMap() {
	const start = performance.now()
	let arr: string[] = []
	for (let i = 0; i < 0xffff; i++) {
		arr.push(String.fromCharCode(i))
	}
	arr = arr.sort((a, b) => a.localeCompare(b))
	map = new Map()
	for (let i = 0, n = arr.length; i < n; i++) {
		map.set(arr[i], i)
	}
	firstNonLetterIndex = map.size
	console.log(`[pyhjvs] createMap took ${performance.now() - start} ms`)
}

export function stringToIdbSortable(s: string) {
	if (!map) createMap()
	s = s.toLocaleLowerCase()
	return s.replace(/./g, match => {
		let index = map!.get(match)
		if (!isNumber(index)) {
			index = firstNonLetterIndex + match.charCodeAt(0)
		}
		return String.fromCharCode(index)
	})
}
