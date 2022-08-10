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
	console.log("PAYLOAD", payload)
	const { id } = req.query
	if (req.method === 'POST') {
		try {
			const customer = await prisma.customer.create({
				data: {
					...payload,
					userId: session.id,
					carrierId: payload.carrierId
				}
			});
			console.log(customer);
			res.json(customer);
		} catch (err) {
			console.log(err)
			res.status(500).send({message:'Internal Server Error. Please try again'});
		}
	} else if (req.method === 'PUT'){
		try {
			let { id, ...rest } = payload
			const customer = await prisma.customer.update({
				where: {
					id
				},
				data: {
					...rest,
				}
			});
			console.log(customer);
			res.json(customer);
		} catch (err) {
			console.log(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else if (req.method === 'DELETE'){
		try {
			const result = await prisma.customer.delete({
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