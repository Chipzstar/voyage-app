import { cors, runMiddleware } from '../../index';
import { Carrier, Driver, Load, LoadCustomer, Member, Vehicle } from '../../../../utils/types';
import moment from 'moment';
import { Shipment, Shipper, STATUS, Location, LoadLocation } from '@voyage-app/shared-types';
import { calculateJobDistance } from '@voyage-app/shared-utils';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../db';

interface RequestBodyProps {
	driverId: string,
	controllerId: string
}

export default async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// @ts-ignore
	try {
		const token = await getToken({ req });
		const payload: RequestBodyProps = req.body;
		const { id: shipmentId } = req.query;
		// find a shipment with the given id
		const shipment: Shipment = await prisma.shipment.findFirst({
			where: {
				id: shipmentId
			}
		})
		console.log("Shipment")
		console.log(shipment)
		console.log('-----------------------------------------------');
		// find the shipper with the given shipperId
		const shipper: Shipper = await prisma.shipper.findFirst({
			where: {
				id: shipment?.shipperId
			}
		})
		// find the carrier using the JWT token
		const carrier: Carrier = await prisma.carrier.findFirst({
			where: {
				id: token?.carrierId
			}
		})
		console.log('-----------------------------------------------');
		const driver: Driver = await prisma.driver.findFirst({
			where: {
				id: payload?.driverId
			}
		})
		console.log('-----------------------------------------------');
		const controller: Member = await prisma.member.findFirst({
			where: {
				id: payload?.controllerId
			}
		})
		console.log('-----------------------------------------------');
		const vehicle: Vehicle = await prisma.vehicle.findFirst({
			where: {
				id: driver.vehicleId
			}
		})
		console.log('-----------------------------------------------');
		// calculate distance between origin and destination
		const distance = await calculateJobDistance(shipment.pickup.fullAddress, shipment.delivery.fullAddress, process.env.GOOGLE_MAPS_API_KEY);
		// lookup location entities for pickup and delivery facilities
		const pickupLocation: Location = await prisma.location.findFirst({
			where: {
				id: shipment.pickup.facilityId
			}
		})
		console.log("Pickup")
		console.log(pickupLocation)
		console.log('-----------------------------------------------');
		const deliveryLocation: Location = await prisma.location.findFirst({
			where: {
				id: shipment.delivery.facilityId
			}
		})
		console.log("Delivery")
		console.log(deliveryLocation)
		console.log('-----------------------------------------------');

		const load: Load = {
			id: undefined,
			createdAt: undefined,
			source: 'Marketplace',
			carrierId: <string>token?.carrierId,
			loadId: shipment.shipmentId,
			customer: <LoadCustomer>{
				id: shipment?.shipperId,
				name: shipper.fullName,
				email: shipper.email,
				company: shipper.company
			},
			driver: {
				id: driver.id,
				name: driver.fullName,
				phone: driver.defaultPhone
			},
			status: STATUS.PENDING,
			internalPONumber: shipment.internalPONumber,
			customerPONumber: shipment.customerPONumber,
			rate: shipment.rate,
			mileage: distance,
			pickup: <LoadLocation>{
				fullAddress: shipment.pickup.fullAddress,
				street: pickupLocation.line1 + ' ' + pickupLocation.line2,
				city: pickupLocation.city,
				region: pickupLocation.region,
				postcode: pickupLocation.postcode,
				country: pickupLocation.country,
				location: {
					type: 'Point',
					coordinates: [0, 0]
				},
				window: {
					start: shipment.pickup.window.start,
					end: shipment.pickup.window.end
				},
				note: pickupLocation.pickupInstructions
			},
			delivery: <LoadLocation>{
				fullAddress: shipment.delivery.fullAddress,
				street: deliveryLocation.line1 + ' ' + deliveryLocation.line2,
				city: deliveryLocation.city,
				region: deliveryLocation.region,
				postcode: deliveryLocation.postcode,
				country: deliveryLocation.country,
				location: {
					type: 'Point',
					coordinates: [0, 0]
				},
				note: deliveryLocation.deliveryInstructions
			},
			packageInfo: shipment.packageInfo,
			carrierInfo: {
				name: carrier.company,
				driverId: driver?.driverId,
				driverName: driver?.fullName,
				driverPhone: driver?.defaultPhone,
				controllerId: controller?.memberId,
				controllerName: controller?.firstName + ' ' + controller?.lastName,
				vehicleType: vehicle.vehicleType
			},
			vehicleType: vehicle.vehicleType,
			trackingHistory: [
				{
					status: STATUS.NEW,
					timestamp: moment().unix()
				},
				{
					status: STATUS.PENDING,
					timestamp: moment().unix()
				}
			]
		};
		console.log(load)
		res.status(200).json(load);
	} catch (err) {
		console.error(err)
		res.status(err.status ? err.status : 500).json(err)
	}
}