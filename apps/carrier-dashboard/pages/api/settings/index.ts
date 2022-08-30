import prisma from '../../../db';
import { SignupStatus } from '../../../utils/types';
import { cors, runMiddleware } from '../index';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	let payload = req.body;
	console.log('PAYLOAD', payload);
	if (req.method === 'POST') {
		try {
			const settings = await prisma.settings.create({
				data: {
					...payload,
					carrierId: token?.carrierId
				}
			});
			console.log(settings);
			await prisma.carrier.update({
				where: {
					id: payload.carrierId|| token?.carrierId
				},
				data: {
					status: SignupStatus.BANK_ACCOUNT
				}
			});
			res.status(201).json(settings);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}