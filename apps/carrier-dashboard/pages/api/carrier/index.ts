import { cors, runMiddleware } from '../index';
import prisma from '../../../db';
import { numericId } from '@voyage-app/shared-utils';
import { ActivationStatus } from '../../../utils/types';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const payload = req.body;
	if (req.method === 'POST') {
		try {
			const user = await prisma.user.create({
				data: {
					email: payload.email,
					password: payload.password,
					firstname: payload.firstname,
					lastname: payload.lastname,
					name: payload.firstname + ' ' + payload.lastname
				}
			});
			console.log('USER', user);
			const carrier = await prisma.carrier.create({
				data: {
					fullName: payload.fullName,
					firstname: payload.firstname,
					lastname: payload.lastname,
					company: payload.company,
					email: payload.email,
					phone: payload.phone,
					address: payload.address,
					stripe: {
						accountId: payload.accountId
					},
					userId: user.id,
					carrierId: `CARRIER-ID${numericId(12)}`,
					status: ActivationStatus.COMPANY_INFO
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