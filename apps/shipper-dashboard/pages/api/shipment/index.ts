import { cors, runMiddleware } from '../index';
import { fetchShipments } from '@voyage-app/shared-utils';
import prisma from '../../../db';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	if (req.method === 'GET') {
		try {
			const shipments = await fetchShipments(undefined, prisma);
			res.status(200).json(shipments)
		} catch (err) {
			console.error(err);
			res.status(err.status ? err.status : 500).json(err)
		}
	} else {
		res.setHeader('Allow', 'GET');
		res.status(405).end('Method Not Allowed');
	}
}