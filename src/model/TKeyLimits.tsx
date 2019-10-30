import { MAX_KEY, MIN_KEY } from './constants'

export type TKeyLimits<T> = readonly [T | typeof MIN_KEY, T | typeof MAX_KEY]
