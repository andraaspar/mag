export function dateToString(d: Date): string {
	const year = d.getFullYear()
	const month = (d.getMonth() + 1 + '').padStart(2, '0')
	const date = (d.getDate() + '').padStart(2, '0')
	return `${year}-${month}-${date}`
}
