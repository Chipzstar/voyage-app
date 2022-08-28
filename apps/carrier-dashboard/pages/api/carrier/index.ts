import { cors, runMiddleware } from '../index';
import prisma from '../../../db';
import { numericId } from '@voyage-app/shared-utils';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const payload = req.body;
	console.log('PAYLOAD', payload);
	if (req.method === 'POST') {
		try {
			const user = await prisma.user.create({
				email: payload.email,
				password: payload.password,
				firstname: payload.firstname,
				lastname: payload.lastname,
				name: payload.firstname + ' ' + payload.lastname
			});
			console.log('USER', user);
			const carrier = await prisma.carrier.create({
				data: {
					...payload,
					stripe: {
						accountId: payload.accountId,
						personId: payload.personId
					},
					userId: user.id,
					carrierId: `CARRIER-ID${numericId(12)}`
				}
			});
			console.log('CARRIER', carrier);
			res.json(carrier);
		} catch (err) {
			console.log(err);
			res.status(500).send({ message: 'Internal Server Error. Please try again' });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}