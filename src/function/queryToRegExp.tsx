import escapeStringRegexp from 'escape-string-regexp'

export function queryToRegExp(q: string) {
	return new RegExp(escapeStringRegexp(q.trim()).replace(/\s+/g, `.*`), `i`)
}
