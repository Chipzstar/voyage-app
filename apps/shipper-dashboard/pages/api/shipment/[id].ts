import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const payload = req.body;
	// const { id } = req.query
	if (req.method === 'POST') {
		try {
			const shipment = await prisma.shipment.create({
				data: {
					...payload,
					userId: session.id,
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