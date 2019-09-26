import { isNumber, isString } from 'util'

export type TLoadable<T extends object> = T | null | number | string

export function isLoaded<T extends object>(o: TLoadable<T>): o is T {
	return o != null && !isNumber(o) && !isString(o)
}

export function hasNotStartedLoading(o: TLoadable<any>): o is null {
	return o === null
}

export function isLoading(o: TLoadable<any>): o is number {
	return isNumber(o)
}

export function hasLoadError(o: TLoadable<any>): o is string {
	return isString(o)
}
