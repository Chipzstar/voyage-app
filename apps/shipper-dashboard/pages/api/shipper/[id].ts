import { runMiddleware, cors } from '../index';
import prisma from '../../../db';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const token = await getToken({ req });
	const payload = req.body;
	console.log("PAYLOAD", payload)
	const { id } = req.query
	if (req.method === 'POST') {
		try {
			const shipper = await prisma.shipper.create({
				data: {
					...payload,
					userId: session.id,
					shipperId: payload.shipperId
				}
			});
			console.log(shipper);
			res.json(shipper);
		} catch (err) {
			console.log(err)
			res.status(500).send({message:'Internal Server Error. Please try again'});
		}
	}
	else if (req.method === 'PUT'){
		try {
			let { id, ...rest } = payload
			const shipper = await prisma.shipper.update({
				where: {
					id: id ?? token?.shipperId
				},
				data: {
					...rest,
				}
			});
			console.log(shipper);
			res.json(shipper);
		} catch (err) {
			console.log(err)
			res.status(400).json({ status: 400, message: 'An error occurred!' })
		}
	} else if (req.method === 'DELETE'){
		try {
			const result = await prisma.shipper.delete({
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