import { omit } from './omit'

export function toggle<T extends { [k: string]: boolean }, K extends keyof T>(
	o: T,
	key: K,
	flag: boolean,
): T {
	return flag ? { ...o, [key]: true } : (omit(o, key) as T)
}
