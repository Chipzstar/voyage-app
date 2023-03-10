import {
	ChargeUnitType,
	Customer,
	Driver,
	Load,
	BookingLocation,
	Member,
	NewBooking,
	RateChargeRules,
	Settings
} from './types';
import { LoadLocation, STATUS } from '@voyage-app/shared-types';
import moment from 'moment/moment';
import { numericId, PLACE_TYPES } from '@voyage-app/shared-utils';
import axios from 'axios';

function genFullAddress(location: BookingLocation) {
	let fullAddress = '';
	Object.entries(location).forEach(([key, value]) => {
		if (key !== 'note') fullAddress += value + ' ';
	});
	return fullAddress;
}

export function calculateRate(weight, numPallets, miles = 300, rates: RateChargeRules) {
	console.log(rates);
	console.table({weight, numPallets, miles})
	let total = Object.entries(rates).reduce((prev, [key, rate]) => {
		let newVal = prev;
		if (!rate.active) return prev;
		switch (key) {
			case ChargeUnitType.DISTANCE:
				newVal += miles * rate.value;
				console.log(`Mileage: ${miles} x ${rate.value} = ${newVal}`)
				return newVal;
			case ChargeUnitType.WEIGHT:
				console.log(`Weight: ${weight} x ${rate.value} = ${newVal}`)
				newVal += weight * rate.value;
				return newVal;
			case ChargeUnitType.PACKAGE:
				console.log(`Quantity: ${numPallets} x ${rate.value} = ${newVal}`)
				newVal += numPallets * rate.value;
				return newVal;
			default:
				return prev;
		}
	}, 0);
	// const sum = weight * rates.WEIGHT.value + numPallets * rates.PACKAGE.value + miles * rates.DISTANCE.value;
	return Number((total / 3).toFixed(2));
}

export async function generateLoad(profile, values: NewBooking, drivers: Driver[], controllers: Member[], customers: Customer[], settings: Settings): Promise<Load> {
	const pickup: LoadLocation = {
		...values.pickupLocation,
		fullAddress: genFullAddress(values.pickupLocation),
		window: {
			start: values.pickupDate,
			end: moment.unix(values.pickupDate).add(1, 'hour').unix()
		}
	};
	const delivery: LoadLocation = {
		fullAddress: genFullAddress(values.deliveryLocation),
		...values.deliveryLocation
	};
	const driver = drivers.find(driver => driver.id === values.driverId);
	const controller = controllers.find(controller => controller.id === values.controllerId);
	const customer = customers.find(customers => customers.id === values.customerId);

	const { distance } = (await axios.get(`/api/utils/distance-matrix?pickupAddress=${pickup.fullAddress}&deliverAddress=${delivery.fullAddress}`)).data;

	return {
		id: undefined,
		source: customer.companyName,
		carrierId: profile.id,
		loadId: `VOY-ID${numericId(8)}`,
		customer: {
			id: customer?.id,
			name: customer?.fullName,
			email: customer?.billingEmail || customer?.email,
			company: customer?.companyName
		},
		driver: {
			id: driver?.id,
			name: driver?.fullName,
			phone: driver?.defaultPhone
		},
		createdAt: undefined,
		status: STATUS.NEW,
		internalPONumber: values.internalPONumber,
		customerPONumber: values.customerPONumber,
		rate: calculateRate(values.weight, values.quantity, distance, settings?.rateChargeRules),
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
			name: profile.company,
			driverId: values.driverId,
			driverName: driver?.fullName,
			driverPhone: driver?.defaultPhone,
			controllerId: controller?.memberId,
			controllerName: controller?.firstName + ' ' + controller?.lastName,
			vehicleType: values.vehicleType
		},
		vehicleType: values.vehicleType,
		trackingHistory: [
			{
				status: STATUS.NEW,
				timestamp: moment().unix()
			}
		]
	};
}

export async function fetchCarrier(userId, carrierId, prisma) {
	return await prisma.carrier.findFirst({
		where: {
			OR: [
				{
					userId: {
						equals: userId
					}
				},
				{
					id: {
						equals: carrierId
					}
				}
			]
		},
		select: {
			id: true,
			carrierId: true,
			fullName: true,
			firstname: true,
			lastname: true,
			company: true,
			address: true,
			email: true,
			phone: true,
			stripe: true,
			status: true
		}
	});
}

export async function fetchMembers(carrierId, prisma) {
	let members = await prisma.member.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	members = members.map(member => ({
		...member,
		createdAt: moment(member.createdAt).unix(),
		updatedAt: moment(member.updatedAt).unix()
	}));
	return members;
}

export async function fetchVehicles(carrierId, prisma) {
	let vehicles = await prisma.vehicle.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	vehicles = vehicles.map(vehicle => ({
		...vehicle,
		createdAt: moment(vehicle.createdAt).unix(),
		updatedAt: moment(vehicle.updatedAt).unix()
	}));
	return vehicles;
}

export async function fetchDrivers(carrierId, prisma) {
	let drivers = await prisma.driver.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	drivers = drivers.map(driver => ({
		...driver,
		createdAt: moment(driver.createdAt).unix(),
		updatedAt: moment(driver.updatedAt).unix()
	}));
	return drivers;
}

export async function fetchCustomers(carrierId, prisma) {
	let customers = await prisma.customer.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	customers = customers.map(customer => ({
		...customer,
		createdAt: moment(customer.createdAt).unix(),
		updatedAt: moment(customer.updatedAt).unix()
	}));
	return customers;
}

export async function fetchLoads(carrierId, prisma) {
	let loads = await prisma.load.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	loads = loads.map(load => ({
		...load,
		createdAt: moment(load.createdAt).unix(),
		updatedAt: moment(load.updatedAt).unix()
	}));
	return loads;
}

export async function fetchDocuments(carrierId, prisma) {
	return await prisma.document.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		select: {
			id: true,
			carrierId: true,
			type: true,
			filename: true,
			filepath: true,
			location: true,
			status: true,
			verified: true
		}
	});
}

export async function fetchInvoices(carrierId, prisma) {
	let invoices =  await prisma.invoice.findMany({
		where: {
			carrierId: {
				equals: carrierId
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	invoices = invoices.map(invoice => ({
		...invoice,
		createdAt: moment(invoice.createdAt).unix(),
		updatedAt: moment(invoice.updatedAt).unix()
	}));
	return invoices
}

export async function fetchSettings(carrierId, prisma) {
	return await prisma.settings.findFirst({
		where: {
			carrierId: {
				equals: carrierId
			}
		}
	});
}

export function parseAddress(data, requiresGeoJSON = false) {
	console.log(data);
	let address = data[0].address_components;
	let formattedAddress = {
		street: '',
		city: '',
		postcode: '',
		region: '',
		country: 'UK',
		latitude: data[0].geometry.location.lat(),
		longitude: data[0].geometry.location.lng(),
		...(requiresGeoJSON && {
			geolocation: {
				type: 'Point',
				coordinates: [data[0].geometry.location.lng(), data[0].geometry.location.lat()]
			}
		})
	};
	let components = address.filter(({ types }) => types.some(type => Object.values(PLACE_TYPES).includes(type)));
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
	console.log(formattedAddress);
	return formattedAddress;
}

export function validateAddress(pickup, dropoff) {
	const types = ['street address', 'city', 'postcode'];
	Object.values(pickup).forEach((item: string, index) => {
		if (!item) throw new Error(`Pickup address does not include a '${types[index]}'. Please add all parts of the address and try again`);
		else if (index === 2 && item.length < 6) throw new Error(`Your Pickup postcode,' ${item}', is not complete. Please include a full UK postcode in your address`);
	});
	Object.values(dropoff).forEach((item: string, index) => {
		if (!item) throw new Error(`Dropoff address does not include a '${types[index]}'. Please add all parts of the address and try again`);
		else if (index === 2 && item.length < 6) throw new Error(`Your Dropoff postcode '${item}', is not complete. Please include a full UK postcode in your address`);
	});
	return true;
}

export function generateInvoice(load: Load) {
	// send a post request with the name to our API endpoint
	const fetchData = async () => {
		const data = await fetch('/api/gcp/generate-invoice', {
			method: 'POST',
			body: JSON.stringify(load)
		});
		// convert the response into an array Buffer
		return data.arrayBuffer();
	};
	fetchData().then(blob => console.log('PDF saved successfully!', blob));
}

export async function uploadFile({ id, file, documentType }) {
	try {
		const filename = encodeURIComponent(file.name);
		const res = await fetch(`/api/gcp/upload-url?id=${id}&filename=${filename}&type=${documentType}`);
		const { url, fields } = await res.json();
		const formData = new FormData();

		Object.entries({ ...fields, file }).forEach(([key, value]: [string, string]) => {
			formData.append(key, value);
		});
		console.log(formData);

		const upload = await fetch(url, {
			method: 'POST',
			body: formData
		});

		if (upload.ok) {
			console.log('Uploaded successfully!');
			console.log(upload);
			return upload;
		} else {
			console.error('Upload failed.', upload.status);
			return upload;
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/*export const logger = (() => {
	const isProd = process.env.NODE_ENV === 'production';
	const print = (type, message: string, context = undefined) => {
		if (isProd) {
			switch (type) {
				case 'info':
					logtail.info(message).then(r => console.log("logtail info sent!")).catch(error => console.error(error));
					break;
				case 'warn':
					logtail.warn(message, context);
					break;
				case 'error':
					logtail.error(message, context);
					break;
				case 'debug':
					logtail.debug(message, context);
					break;
				default:
					console.log(message);
			}
		} else {
			console.log(message);
		}
	};

	return {
		debug: print.bind(null, 'debug'),
		info: print.bind(null, 'info'),
		warn: print.bind(null, 'warn'),
		error: print.bind(null, 'error'),
		trace: print.bind(null, 'trace')
	};
})();*/
