import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../db';

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
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
				console.log(user);
				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;
				}
			}
		})
	],
	pages: {
		error: '/login',
		signIn: '/login'
	},
	callbacks: {
		async jwt({token, user, account, profile, isNewUser }) {
			console.log(user)
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			console.log(session)
			if (token){
				session.id = token.id
			}
			return session;
		}
	},
	session: {
		// Set to jwt in order to CredentialsProvider works properly
		strategy: 'jwt'
	},
	secret: process.env.JWT_SCERET || "voyage",
	jwt: {
		secret: process.env.JWT_SECRET || "voyage",
		encryption: true
	},
	debug: process.env.NODE_ENV === 'development'
};

// @ts-ignore
export default (req, res) => NextAuth(req, res, authOptions)