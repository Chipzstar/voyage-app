/*
import { PrismaClient } from '@prisma/client'

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ['query'],
	})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma*/

import { PrismaClient } from '@prisma/client'
import { fieldEncryptionMiddleware } from 'prisma-field-encryption'

let prisma
if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient()
	prisma.$use(fieldEncryptionMiddleware())
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient()
	}
	prisma = global.prisma
	prisma.$use(fieldEncryptionMiddleware())
}
export default prisma
