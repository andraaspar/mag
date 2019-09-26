export function url(
	literals: TemplateStringsArray,
	...placeholders: (string | number)[]
) {
	let result = ''
	for (let i = 0; i < placeholders.length; i++) {
		result += literals[i]
		result += encodeURIComponent(placeholders[i])
	}
	result += literals[literals.length - 1]
	return result
}
