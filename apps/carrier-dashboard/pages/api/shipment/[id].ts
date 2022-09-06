import { cors, runMiddleware } from '../index';
import { Shipment } from '@voyage-app/shared-types';
import prisma from '../../../db';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	if (req.method === 'PUT') {
		try {
			const { id } = req.query;
			const payload = req.body;
			console.log("Payload")
			console.log(payload)
			console.log('-----------------------------------------------')
			// find a shipment with the given id
			const shipment: Shipment = await prisma.shipment.update({
				where: {
					id
				},
				data: payload
			})
			console.log(shipment)
			res.status(200).json(shipment);
		} catch (err) {
			console.error(err)
			res.status(err.status ? err.status : 500).json(err)
		}
	} else {
		res.setHeader('Allow', 'PUT');
		res.status(405).end('Method Not Allowed');
	}
}