import { cors, runMiddleware } from '../index';
import { NextApiRequest, NextApiResponse } from 'next';
import { calculateJobDistance } from '@voyage-app/shared-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	const { pickupAddress, deliverAddress } = req.query;
	try {
		const distance = await calculateJobDistance(pickupAddress, deliverAddress, process.env.GOOGLE_MAPS_API_KEY);
		res.status(200).json({ distance });
	} catch (err) {
		console.error(err);
		res.status(400).json({ success: false, message: err.message });
	}
}
