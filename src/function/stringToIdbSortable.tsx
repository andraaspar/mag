import { isNumber } from 'util'

let _map: Map<string, number> | null = null
let firstNonLetterIndex = 0

function createMap() {
	const start = performance.now()
	let arr: string[] = []
	for (let i = 0; i <= 0xffff; i++) {
		arr.push(String.fromCharCode(i))
	}
	arr = arr.sort((a, b) => a.localeCompare(b))
	const map = new Map()
	for (let i = 0, n = arr.length; i < n; i++) {
		map.set(arr[i], i)
	}
	firstNonLetterIndex = map.size
	console.log(`[pyhjvs] createMap took ${performance.now() - start} ms`)
	return map
}

export function getStringToIdbSortableMap() {
	if (!_map) _map = createMap()
	return _map!
}

export function setStringToIdbSortableMap(map: Map<string, number>) {
	_map = map
}

export function stringToIdbSortable(
	s: string,
	{ reverse }: { reverse?: boolean } = {},
) {
	const map = getStringToIdbSortableMap()
	s = s.toLocaleLowerCase()
	return s.replace(/./g, match => {
		let index = map.get(match)
		if (!isNumber(index)) {
			index = firstNonLetterIndex + match.charCodeAt(0)
		}
		if (reverse) {
			index = 0xffff - index
		}
		return String.fromCharCode(index)
	})
}
