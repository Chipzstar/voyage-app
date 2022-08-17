import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';
import { Settings } from '../../../utils/types';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	let { id, ...payload } = req.body;
	console.log('PAYLOAD', payload);
	const { id: ID } = req.query;
	console.table({ ID });
	if (req.method === 'POST') {
		try {
			const settings = await prisma.settings.create({
				data: {
					...payload,
					carrierId: token?.carrierId
				}
			});
			console.log(settings);
			res.status(201).json(settings);
		} catch (err) {
			console.log(err);
			res.status(500).send({ message: 'Internal Server Error. Please try again' });
		}
	} else if (req.method === 'PUT') {
		try {
			const settings = await prisma.settings.update({
				where: {
					id: ID
				},
				data: {
					...payload
				}
			});
			console.log(settings);
			res.status(200).json(settings);
		} catch (err) {
			console.log(err);
			res.status(400).json({ status: 400, message: 'An error occurred!' });
		}
	} else if (req.method === 'DELETE') {
		try {
			const result = await prisma.settings.delete({
				where: {
					id: ID
				}
			});
			console.log(result);
			res.json({ success: true });
		} catch (err) {
			console.error(err);
			res.status(400).json({ success: false });
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}