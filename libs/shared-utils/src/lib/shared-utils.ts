import moment from 'moment';
import { showNotification } from '@mantine/notifications';
import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import { DateRange, UnixTimestamp, Geolocation, LoadLocation } from '@voyage-app/shared-types';
import { PLACE_TYPES } from './shared-constants';

const GMapsClient = new Client();

interface selectInput {
	value: string;
	label: string;
}
// functions
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

}
export function sanitize(str: string): string {
	return str.replace(/[_-]/g, ' ').toLowerCase();

}
export function uniqueArray(array: selectInput[], key) {
	return [...new Map(array.map(item => [item[key], item])).values()];

}
export function getYears(amount: number): string[] {
	return [...Array(amount).keys()].map(pos => moment().subtract(pos, 'y').year().toString());

}
export function sortByDate(data, order = 'desc') {
	order === 'desc' ? data.sort((a, b) => b['createdAt'] - a['createdAt']) : data.sort((a, b) => a['createdAt'] - b['createdAt']);
	return data;

}
export function includesCaseInsensitive(this: string, str: string): boolean {
	return this.toLowerCase().includes(str.toLowerCase());

}
export function isValidUrl(urlString) {
	try {
		return Boolean(new URL(urlString));
	}
	catch(e){
		return false;
	}

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
export function notifySuccess(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		disallowClose: true,
		onClose: () => console.log('unmounted'),
		onOpen: () => console.log('mounted'),
		autoClose: 3000,
		title: 'Success',
		message,
		color: 'green',
		icon,
		loading: false
	});

}
export function notifyError(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		disallowClose: true,
		onClose: () => console.log('unmounted'),
		onOpen: () => console.log('mounted'),
		autoClose: 5000,
		title: 'Error',
		message,
		color: 'red',
		icon,
		loading: false
	});

}

export async function calculateJobDistance(origin, destination, GMAPS_API_KEY) {
	console.log('PICKUP:', origin);
	console.log('DROPOFF:', destination);
	try {
		const distanceMatrix = (
			await GMapsClient.distancematrix({
				params: {
					key: GMAPS_API_KEY,
					origins: [origin],
					destinations: [destination],
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

export async function geocodeAddress(address: string, GMAPS_API_KEY) {
	try {
		const response = (
			await GMapsClient.geocode({
				params: {
					address,
					key: GMAPS_API_KEY
				}
			})
		).data;

		if (response.results.length) {
			const formattedAddress: Omit<LoadLocation, "fullAddress"> = {
				street: '',
				city: '',
				region: '',
				postcode: '',
				country: 'UK',
				location: <Geolocation>{
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

export function checkWithinTimeRange(dateRange: DateRange, start: UnixTimestamp, end: UnixTimestamp){
	const isValid = moment.unix(start).isAfter(moment(dateRange[0]).startOf('day'), 'm') && moment.unix(end).isBefore(moment(dateRange[1]).endOf('day'), 'm')
	console.log("isWithinRange:", isValid)
	return isValid;
}