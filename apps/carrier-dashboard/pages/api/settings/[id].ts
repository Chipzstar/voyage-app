import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	let payload = req.body;
	console.log('PAYLOAD', payload);
	const { id: ID } = req.query;
	if (req.method === 'PUT') {
		const { id, ...rest } = payload;
		try {
			const settings = await prisma.settings.update({
				where: {
					OR: [
						{
							id: ID
						},
						{
							carrierId: token?.carrierId
						}
					]
				},
				data: {
					...rest
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
					carrierId: token?.carrierId
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