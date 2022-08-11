import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const payload = req.body;
	const token = await getToken({ req });
	console.log("PAYLOAD", payload)
	const { id } = req.query
	if (req.method === 'POST') {
		try {
			const load = await prisma.load.create({
				data: {
					...payload,
					carrierId: payload?.carrierId || token?.carrierId
				}
			});
			console.log(load);
			res.json(load);
		} catch (err) {
			console.log(err)
			res.status(500).send({message:'Internal Server Error. Please try again'});
		}
	} else if (req.method === 'PUT'){
		try {
			let { id, ...rest } = payload
			const load = await prisma.load.update({
				where: {
					id
				},
				data: {
					...rest,
				}
			});
			console.log(load);
			res.json(load);
		} catch (err) {
			console.log(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else if (req.method === 'DELETE'){
		try {
			const result = await prisma.load.delete({
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