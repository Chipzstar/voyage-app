import { cors, runMiddleware } from '../index';
import { fetchLoads } from '../../../utils/functions';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	if (req.method === 'GET') {
		try {
			const token = await getToken({ req })
			const loads = await fetchLoads(token?.carrierId, prisma);
			res.status(200).json(loads)
		} catch (err) {
			console.error(err);
			res.status(err.status ? err.status : 500).json(err)
		}
	} else {
		res.setHeader('Allow', 'GET');
		res.status(405).end('Method Not Allowed');
	}
}