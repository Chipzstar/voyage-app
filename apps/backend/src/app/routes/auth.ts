import { Express } from 'express';
import prisma from '../prisma';

interface User {
	email: string,
	password: string
}

const users: User[] = [
	{ email: 'chisom@usevoyage.com', password: 'admin' },
	{ email: 'ola@usevoyage.com', password: 'admin' },
	{ email: 'rayan@usevoyage.com', password: 'admin' }
];

export function addUserRoutes(app: Express) {
	app.get('/server/auth/users', (req, resp) => resp.send(users));
	app.post('/server/auth/user', async (req, resp) => {
		const newUser = await prisma.user.create({
			data: {
				email: req.body.email,
				password: req.body.password
			}
		})
		console.log(newUser)
		resp.json(newUser);
	});
}
