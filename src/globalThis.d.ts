declare module globalThis {
	export var setIsCached: ((flag: boolean) => void) | undefined
	export var setHasUpdate: ((flag: boolean) => void) | undefined
}
