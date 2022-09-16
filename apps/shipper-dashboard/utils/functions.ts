import { Booking } from './types';
import moment from 'moment';
import { numericId } from '@voyage-app/shared-utils';
import { Delivery, Location, Pickup, Shipment, Shipper, STATUS } from '@voyage-app/shared-types';
import axios from 'axios';

export function calculateRate(weight, numPallets, miles = 300) {
	const sum = weight * 0.02 + numPallets * 25.7 + miles * 4.2;
	console.log('Estimated rate:', `£${sum}`);
	return sum;
}

export async function generateShipment(values: Booking, pickupLocation: Location, deliveryLocation: Location, shipperInfo: Shipper): Promise<Shipment> {
	const pickup: Pickup = {
		facilityId: pickupLocation.id,
		facilityName: pickupLocation.name,
		fullAddress: `${pickupLocation.line1} ${pickupLocation.line2} ${pickupLocation.city} ${pickupLocation.postcode}`,
		line1: pickupLocation.line1,
		line2: pickupLocation.line2,
		city: pickupLocation.city,
		region: pickupLocation.region,
		postcode: pickupLocation.postcode,
		window: {
			start: values.pickupDate,
			end: moment.unix(values.pickupDate).add(1, 'hour').unix()
		}
	};
	const delivery: Delivery = {
		facilityId: deliveryLocation.id,
		facilityName: deliveryLocation.name,
		fullAddress: `${deliveryLocation.line1} ${deliveryLocation.line2} ${deliveryLocation.city} ${deliveryLocation.postcode}`,
		line1: deliveryLocation.line1,
		line2: deliveryLocation.line2,
		city: deliveryLocation.city,
		region: deliveryLocation.region,
		postcode: deliveryLocation.postcode,
	};
	try {
		const { distance } = (
			await axios.post('/api/utils/distance-matrix', {
				pickupAddress: pickup.fullAddress,
				deliverAddress: delivery.fullAddress
			})
		).data;
		return {
			id: undefined,
			shipperId: undefined,
			shipmentId: `VOY-ID${numericId(8)}`,
			createdAt: values.createdAt,
			bookingStatus: 'Booked',
			status: STATUS.NEW,
			serviceType: values.serviceType,
			shipmentType: values.shipmentType,
			schedulingType: values.schedulingType,
			activitiesRequired: values.activitiesRequired,
			internalPONumber: values.internalPONumber,
			customerPONumber: values.customerPONumber,
			rate: calculateRate(values.weight, values.quantity, distance),
			mileage: distance,
			pickup,
			delivery,
			packageInfo: {
				weight: values.weight,
				quantity: values.quantity,
				dimensions: {
					height: values.height,
					width: values.width,
					length: values.length
				},
				packageType: values.packageType,
				description: values.description
			},
			shipperInfo: {
				name: shipperInfo.fullName,
				company: shipperInfo.company,
				email: shipperInfo.email,
				phone: shipperInfo.phone
			},
			carrierInfo: {
				name: '',
				driverId: '',
				driverName: '',
				driverPhone: '',
				location: []
			},
			trackingHistory: [
				{
					status: STATUS.NEW,
					timestamp: moment().unix()
				}
			]
		};
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export function filterByTimeRange(data: [], range: [Date, Date]) {
	const startDate = moment(range[0]).startOf('day');
	const endDate = moment(range[1]).endOf('day');
	return data.filter(({ createdAt }) => {
		const curr = moment.unix(createdAt);
		return curr.isBefore(endDate) && curr.isAfter(startDate);
	});
}

export async function fetchShipper(userId, shipperId, prisma) : Promise<Shipper> {
	return await prisma.shipper.findFirst({
		where: {
			OR: [
				{
					userId: {
						equals: userId
					}
				},
				{
					id: {
						equals: shipperId
					}
				}
			]
		},
		select: {
			id: true,
			shipperId: true,
			fullName: true,
			firstname: true,
			lastname: true,
			company: true,
			address: true,
			email: true,
			phone: true,
			stripe: true
		}
	});
}

export async function fetchLocations(shipperId, prisma) : Promise<Location[]> {
	let locations = await prisma.location.findMany({
		where: {
			shipperId: {
				equals: shipperId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	locations = locations.map(location => ({
		...location,
		createdAt: moment(location.createdAt).unix(),
		updatedAt: moment(location.updatedAt).unix()
	}));
	return locations;
}

export async function fetchBookings(shipperId, prisma) : Promise<Booking[]>{
	let bookings = await prisma.booking.findMany({
		where: {
			shipperId: {
				equals: shipperId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	bookings = bookings.map(booking => ({
		...booking,
		createdAt: moment(booking.createdAt).unix(),
		updatedAt: moment(booking.updatedAt).unix()
	}));
	return bookings;
}