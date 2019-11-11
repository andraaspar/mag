import { createContext } from 'react'

export interface ShieldContextType {
	showShield: (key: string) => void
	hideShield: (key: string) => void
}

export const ShieldContext = createContext<ShieldContextType>({
	showShield: () => {},
	hideShield: () => {},
})
