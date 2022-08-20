import { cors, runMiddleware } from '../index';
import { NextApiRequest, NextApiResponse } from 'next';
import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';

const GMapsClient = new Client();

async function calculateJobDistance(origin, destination) {
	console.log('PICKUP:', origin);
	console.log('DROPOFF:', destination);
	try {
		const distanceMatrix = (
			await GMapsClient.distancematrix({
				params: {
					origins: [origin],
					destinations: [destination],
					key: process.env.GOOGLE_MAPS_API_KEY,
					units: UnitSystem.imperial,
					mode: TravelMode.driving
				},
				responseType: 'json'
			})
		).data;
		console.log(distanceMatrix.rows[0].elements[0]);
		let distance = Number(distanceMatrix.rows[0].elements[0].distance.text.split(' ')[0]);
		let unit = distanceMatrix.rows[0].elements[0].distance.text.split(' ')[1];
		if (unit === 'ft') distance = 4;
		console.log('================================================');
		console.log('JOB DISTANCE');
		console.log(distance + ' miles');
		console.log('================================================');
		return distance;
	} catch (err) {
		throw err;
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors);
	const { pickupAddress, deliverAddress } = req.query;
	try {
	    const distance = await calculateJobDistance(pickupAddress, deliverAddress)
		res.status(200).json({distance})
	} catch (err) {
	    console.error(err)
		res.status(400).json({success: false, message: err.message})
	}
}
