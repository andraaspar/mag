export function sanitizeString(s: string): string {
	return s.trim().replace(/\s+/g, ' ')
}
