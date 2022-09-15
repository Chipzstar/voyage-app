import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt'
import { Load } from '../../../utils/types'
import prisma from '../../../db';
import { geocodeAddress } from '@voyage-app/shared-utils';

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const token = await getToken({ req });
	const { id } = req.query
	if (req.method === 'POST') {
		try {
			const payload: Load = req.body;
			console.log("PAYLOAD", payload)
			// geocode pickup and delivery addresses
			const { fullAddress: pickupFullAddress, formattedAddress: pickupFormattedAddress } = await geocodeAddress(payload.pickup.fullAddress, process.env.GOOGLE_MAPS_API_KEY)
			const { fullAddress: deliveryFullAddress, formattedAddress: deliveryFormattedAddress } = await geocodeAddress(payload.delivery.fullAddress, process.env.GOOGLE_MAPS_API_KEY)
			const load = await prisma.load.create({
				data: <Load>{
					...payload,
					pickup: {
						...payload.pickup,
						...pickupFormattedAddress
					},
					delivery: {
						...payload.delivery,
						...deliveryFormattedAddress
					},
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
			let { id, ...rest } = req.body
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