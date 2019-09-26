import { isString } from 'util'

export function readJsonFromFile<T extends any>(file: File) {
	return new Promise<T>((resolve, reject) => {
		const reader = new FileReader()
		reader.addEventListener('load', () => {
			try {
				if (!isString(reader.result)) {
					throw new Error(`[pydwop] ${reader.result}`)
				}
				resolve(JSON.parse(reader.result))
			} catch (e) {
				reject(e)
			}
		})
		reader.addEventListener('error', () => {
			reject(reader.error)
		})
		reader.readAsText(file)
	})
}
