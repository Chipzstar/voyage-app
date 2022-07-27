import { Delivery, Location, NewBooking, Pickup, Shipment, STATUS } from './types'
import moment from 'moment';
import { numericId, calculateRate } from '@voyage-app/shared-utils'

export function generateShipment(values: NewBooking, pickupLocation: Location, deliveryLocation: Location) : Omit<Shipment, "id"> {
	const pickup: Pickup = {
		facilityId: pickupLocation.id,
		facilityName: pickupLocation.name,
		location: `${pickupLocation.addressLine1} ${pickupLocation.postcode}`,
		window: {
			start: moment(values.pickupDate).unix(),
			end: moment(values.pickupDate).add(1, "hour").unix()
		}
	};
	const delivery: Delivery = {
		facilityId: deliveryLocation.id,
		facilityName: deliveryLocation.name,
		location: `${deliveryLocation.addressLine1} ${deliveryLocation.postcode}`
	}
	return {
		shipmentId: `VOY-ID${numericId(3)}`,
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
		package: {
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
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Tony Soprano',
			driverPhone: '+447592136042',
			vehicle: 'Ford Trailer Truck',
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