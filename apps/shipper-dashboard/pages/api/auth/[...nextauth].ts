import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../db';

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' }
			},
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied
				if (credentials == null) return null;
				const user = await prisma.user.findFirst({
					where: {
						email: {
							equals: credentials.email
						}
					}
				});
				if (user) {
					const shipper = await prisma.shipper.findFirst({
						where: {
							userId: {
								equals: user.id
							}
						}
					});
					// Any object returned will be saved in `user` property of the JWT
					return { ...user, shipperId: shipper?.id ?? null };
				}
				// If you return null then an error will be displayed advising the user to check their details.
				return null;
			}
		})
	],
	pages: {
		error: '/login',
		signIn: '/login'
	},
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.shipperId = user?.shipperId
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.id = token.id;
			}
			return session;
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		// Set to jwt in order to CredentialsProvider works properly
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	jwt: {
		encryption: true
	},
	debug: process.env.NODE_ENV !== 'production'
};

// @ts-ignore
export default (req, res) => NextAuth(req, res, authOptions)