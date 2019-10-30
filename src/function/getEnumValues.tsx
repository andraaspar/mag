export function getEnumValues(e: { [k: number]: string }) {
	return Object.keys(e)
		.map(_ => parseInt(_, 10))
		.filter(_ => !isNaN(_))
}
