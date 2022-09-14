import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../db';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const { id } = req.query;
	const payload = req.body;
	console.log('Payload');
	console.log(payload);
	console.log('-----------------------------------------------');
	if (req.method === 'POST') {
		try {
			const booking = await prisma.booking.create({
				data: {
					...payload,
					shipperId: token?.shipperId
				}
			});
			console.log(booking);
			res.status(200).json(booking);
		} catch (err) {
			console.error(err);
			res.status(400).send(err);
		}
	} else if (req.method === 'PUT') {
		try {
			const booking = await prisma.booking.update({
				where: {
					id
				},
				data: payload
			});
			console.log(booking);
			res.status(200).json(booking);
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	} else if (req.method === 'DELETE') {
		try {
			const booking = await prisma.booking.delete({
				where: {
					id
				},
			});
			console.log(booking);
			res.status(200).json(booking);
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}