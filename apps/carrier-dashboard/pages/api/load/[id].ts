import { runMiddleware, cors } from '../index';
import { getToken } from 'next-auth/jwt'
import { Load, LoadLocation } from '../../../utils/types'
import { Client } from '@googlemaps/google-maps-services-js'
import prisma from '../../../db';
import { PLACE_TYPES } from '../../../utils/constants'

const GMapsClient = new Client();

async function geocodeAddress(address: string) {
	try {
		const response = (
			await GMapsClient.geocode({
				params: {
					address,
					key: process.env.GOOGLE_MAPS_API_KEY
				}
			})
		).data;

		if (response.results.length) {
			const formattedAddress: LoadLocation = {
				street: '',
				city: '',
				region: '',
				postcode: '',
				country: 'UK',
				location: {
					type: 'Point',
					coordinates: [response.results[0].geometry.location.lng, response.results[0].geometry.location.lat]
				}
			};
			let fullAddress = response.results[0].formatted_address;
			let components = response.results[0].address_components;
			components.forEach(({ long_name, types }) => {
				switch (types[0]) {
					case PLACE_TYPES.ESTABLISHMENT:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.STREET_NUMBER:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.STREET_ADDRESS:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.SUB_PREMISE:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.PREMISE:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.INTERSECTION:
						formattedAddress.street = formattedAddress.street + long_name + ' ';
						break;
					case PLACE_TYPES.CITY:
						formattedAddress.city = long_name;
						break;
					case PLACE_TYPES.POSTCODE:
						formattedAddress.postcode = long_name;
						break;
					case PLACE_TYPES.POSTCODE_PREFIX:
						// make postcode property empty since the real value is not a full postcode
						formattedAddress.postcode = long_name;
						break;
					default:
						return;
				}
			});
			return { fullAddress, formattedAddress };
		}
		throw new Error('No Address suggestions found');
	} catch (e) {
		console.error(e);
		throw e;
	}
}

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
			const { fullAddress: pickupFullAddress, formattedAddress: pickupFormattedAddress } = await geocodeAddress(payload.pickup.fullAddress)
			const { fullAddress: deliveryFullAddress, formattedAddress: deliveryFormattedAddress } = await geocodeAddress(payload.delivery.fullAddress)
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