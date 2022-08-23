import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const payload = req.body;
	if (req.method === 'POST') {
		try {
			const shipment = await prisma.shipment.create({
				data: {
					...payload,
					shipperId: token?.shipperId,
				}
			});
			console.log(shipment);
			res.json(shipment);
		} catch (err) {
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}