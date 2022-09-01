import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt'
import prisma from '../../../db';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({req})
	const payload = req.body;
	const { id } = req.query;
	console.log(id)
	if (req.method === 'POST') {
		try {
			const location = await prisma.location.create({
				data: {
					...payload,
					shipperId: token?.shipperId,
				}
			});
			console.log(location);
			res.json(location);
		} catch (err) {
			console.error(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else if (req.method === 'PUT'){
		try {
			const location = await prisma.location.update({
				where: {
					id
				},
				data: {
					...payload,
				}
			});
			console.log(location);
			res.json(location);
		} catch (err) {
			console.error(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else if (req.method === 'DELETE'){
		try {
			console.log(prisma)
			const result = await prisma.location.delete({
				where: {
					id
				}
			});
			console.log(result)
			res.json({success: true})
		} catch (err) {
		    console.error(err)
			res.status(400).json({success: false})
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}