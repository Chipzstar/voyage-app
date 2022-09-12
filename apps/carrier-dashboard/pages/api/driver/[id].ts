import { cors, runMiddleware } from '../index';
import prisma from '../../../db';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	let payload = req.body;
	console.log('PAYLOAD', payload);
	const { id } = req.query;
	if (req.method === 'POST') {
		try {
			const driver = await prisma.driver.create({
				data: {
					...payload,
					carrierId: payload.carrierId
				}
			});
			console.log(driver);
			res.json(driver);
		} catch (err) {
			console.log(err);
			res.status(500).send({ message: 'Internal Server Error. Please try again' });
		}
	} else if (req.method === 'PUT') {
		try {
			let { id, ...rest } = payload;
			const driver = await prisma.driver.update({
				where: {
					id
				},
				data: {
					...rest
				}
			});
			console.log(driver);
			res.json(driver);
		} catch (err) {
			console.error(err);
			res.status(400).send({ message: 'An error occurred!' });
		}
	} else if (req.method === 'DELETE') {
		try {
			const result = await prisma.driver.delete({
				where: {
					id
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