import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../db';
import moment from 'moment';
import { Shipment, STATUS } from '@voyage-app/shared-types';

async function checkShipmentExpired(id) {
	let { createdAt, updatedAt, ...shipment } = await prisma.shipment.findFirst({
		where: {
			id
		}
	});
	if ([STATUS.NEW, STATUS.PENDING].includes(shipment.status)){
		await prisma.shipment.update({
			where: {
				id
			},
			data: {
				status: STATUS.EXPIRED,
				trackingHistory: [
					...shipment.trackingHistory,
					{
						status: STATUS.EXPIRED,
						timestamp: moment().unix(),
					}
				]
			}
		})
		console.log('************************************************');
		console.log(`Shipment ${id} is now expired!`)
		console.log('************************************************');
	}
	return
}

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	const token = await getToken({ req });
	const payload: Partial<Shipment> = req.body;
	console.log("Payload")
	console.log(payload)
	console.log('-----------------------------------------------');
	if (req.method === 'POST') {
		try {
			const shipment = await prisma.shipment.create({
				data: {
					...payload,
					shipperId: token?.shipperId
				}
			});
			// when current time matches the expiry timestamp and shipment is still NEW or PENDING, set status to EXPIRED
			let timeout = moment.unix(payload.expiresAt).diff(moment())
			console.log('************************************************');
			console.log("Timout (in milliseconds): " + timeout)
			console.log('************************************************');
			setTimeout(checkShipmentExpired, timeout, shipment.id)
			console.log(shipment);
			res.status(200).json(shipment);
		} catch (err) {
			console.error(err)
			res.status(400).send(err)
		}
	} else {
		res.status(404).json({ status: 404, message: 'Unrecognised HTTP method used' });
	}
}