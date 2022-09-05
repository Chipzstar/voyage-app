import { Delivery, NewBooking, Pickup, STATUS } from './types'
import moment from 'moment';
import { numericId } from '@voyage-app/shared-utils'
import { Location, Shipment } from '@voyage-app/shared-types';

export function calculateRate(
	weight,
	numPallets,
	miles = 300,
) {
	const sum = weight * 0.02 + numPallets * 25.7 + miles * 4.2;
	console.log("Estimated rate:", `£${sum}`)
	return sum
}

export function generateShipment(values: NewBooking, pickupLocation: Location, deliveryLocation: Location) : Shipment {
	console.log(values.pickupDate)
	const pickup: Pickup = {
		facilityId: pickupLocation.id,
		facilityName: pickupLocation.name,
		location: `${pickupLocation.addressLine1} ${pickupLocation.postcode}`,
		window: {
			start: values.pickupDate,
			end: moment.unix(values.pickupDate).add(1, "hour").unix()
		}
	};
	const delivery: Delivery = {
		facilityId: deliveryLocation.id,
		facilityName: deliveryLocation.name,
		location: `${deliveryLocation.addressLine1} ${deliveryLocation.postcode}`
	}

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
		rate: calculateRate(values.weight, values.quantity),
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
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: '',
			driverName: 'Tony Soprano',
			driverPhone: '+447592136042',
			location: [-1.778197, 52.412811]
		}
	};
}

export function filterByTimeRange(data: [], range: [Date, Date]){
	const startDate = moment(range[0]).startOf('day')
	const endDate = moment(range[1]).endOf('day')
	return data.filter(({createdAt}) => {
		const curr = moment.unix(createdAt);
		return curr.isBefore(endDate) && curr.isAfter(startDate)
	})
}

export async function fetchShipments(shipperId, prisma) {
	let shipments = await prisma.shipment.findMany({
		where: {
			shipperId: {
				equals: shipperId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	shipments = shipments.map(shipment => ({
		...shipment,
		createdAt: moment(shipment.createdAt).unix(),
		updatedAt: moment(shipment.updatedAt).unix()
	}));
	return shipments
}

export async function fetchLocations(shipperId, prisma){
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
	return locations
}

export async function fetchBookings(shipperId, prisma){
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
	return bookings
}