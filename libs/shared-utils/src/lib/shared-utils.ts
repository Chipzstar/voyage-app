/*import { PrismaClient } from '@prisma/client'

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	let prisma: PrismaClient | undefined
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ['query'],
	})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma*/

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
