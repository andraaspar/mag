export function hasKeys(o: { [k: string]: any }) {
	for (let i in o) {
		if (Object.prototype.hasOwnProperty.call(o, i)) {
			return true
		}
	}
	return false
}
