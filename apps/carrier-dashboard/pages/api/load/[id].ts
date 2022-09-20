import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt';
import { Carrier, Load, Document } from '../../../utils/types';
import prisma from '../../../db';
import { geocodeAddress } from '@voyage-app/shared-utils';

async function checkCarrierPermissions(token): Promise<{isAllowed: boolean, message: string}> {
	let isAllowed = false;
	try {
		const carrier: Carrier = await prisma.carrier.findFirst({
			where: {
				id: token?.carrierId
			}
		});
		// check if the carrier has a bank account
		const bankAccount = carrier?.stripe?.bankAccount;
		if (!bankAccount) return { isAllowed, message: "No bank account found. Please add a bank account in the Settings page before creating loads"}
		// check if the carrier has all 3 document types verified
		const documents: Document[] = await prisma.document.findMany({
			where: {
				carrierId: token?.carrierId
			}
		})
		const verified = documents.every(document => document.verified)
		console.log('-----------------------------------------------');
		console.log("Verified:", verified)
		console.log('-----------------------------------------------');
		if (!verified) return { isAllowed, message: "Your license documents are still being checked. Please try again once all your documents have been verified."}
		isAllowed = !!bankAccount && !!verified;
		return { isAllowed, message: "Carrier is allowed to create loads!"};
	} catch (err) {
		console.log(err)
		return { isAllowed: false, message: err.message };
	}
}

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const token = await getToken({ req });
	const { id } = req.query;
	if (req.method === 'POST') {
		try {
			const payload: Load = req.body;
			console.log('PAYLOAD', payload);
			// validate whether the shipper is allowed to create shipments
			const { isAllowed, message } = await checkCarrierPermissions(token);
			if (isAllowed) {
				// geocode pickup and delivery addresses
				const { fullAddress: pickupFullAddress, formattedAddress: pickupFormattedAddress } = await geocodeAddress(payload.pickup.fullAddress, process.env.GOOGLE_MAPS_API_KEY);
				const { fullAddress: deliveryFullAddress, formattedAddress: deliveryFormattedAddress } = await geocodeAddress(payload.delivery.fullAddress, process.env.GOOGLE_MAPS_API_KEY);
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
			} else {
				res.status(403).json({ message })
			}
		} catch (err) {
			console.log(err);
			res.status(500).send({ message: 'Internal Server Error. Please try again' });
		}
	} else if (req.method === 'PUT') {
		try {
			let { id, ...rest } = req.body;
			const load = await prisma.load.update({
				where: {
					id
				},
				data: {
					...rest
				}
			});
			console.log(load);
			res.json(load);
		} catch (err) {
			console.log(err);
			res.status(400).json({ status: 400, message: 'An error occurred!' });
		}
	} else if (req.method === 'DELETE') {
		try {
			const result = await prisma.load.delete({
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