import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	let payload = req.body;
	const { id: ID } = req.query;
	console.log('PAYLOAD', payload);
	if (req.method === 'PUT') {
		try {
			const settings = await prisma.settings.update({
				where: {
					id: ID
				},
				data: payload
			});
			console.log(settings);
			res.status(200).json(settings);
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	} else if (req.method === 'DELETE') {
		try {
			const result = await prisma.settings.delete({
				where: {
					OR: [
						{
							id: ID
						},
						{
							carrierId: token?.carrierId
						}
					]
				}
			});
			console.log(result);
			res.json({ success: true });
		} catch (err) {
			console.error(err);
			res.status(400).json(err);
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}
