import moment from 'moment';
import { PACKAGE_TYPE, STATUS } from '@voyage-app/shared-types';
import { alphanumericId } from '@voyage-app/shared-utils';
import { Driver, DRIVER_STATUS, FuelMeasurementUnit, FuelType, INVOICE_STATUS, Load, Member, TeamRole, Vehicle, VEHICLE_STATUS, VEHICLE_TYPES } from './types';
import orderId from 'order-id';

export const DEBUG_MODE = process.env.NODE_ENV !== 'production'

export const PUBLIC_PATHS = {
	LOGIN: '/login'
};

export const PATHS = {
	HOME: '/',
	MARKETPLACE: '/marketplace',
	FLEETS: '/fleets',
	ACCOUNTS: '/accounts',
	REPORTING: '/reports',
	SETTINGS: '/settings',
	TRIPS: '/trips',
	BOOK: '/trips/book',
	DRIVERS: '/fleets/drivers',
	NEW_DRIVER: '/fleets/drivers/create',
	TEAM: '/fleets/team',
	NEW_MEMBER: '/fleets/team/create',
	VEHICLES: '/fleets/vehicles',
	NEW_VEHICLE: '/fleets/vehicles/create',
	CUSTOMERS: '/accounts/customers',
	NEW_ACCOUNT: '/accounts/customers/create',
	PAYMENTS: '/accounts/payments',
	INVOICES: '/accounts/invoices',
	BASIC_REPORT: '/reports',
	FUEL_REPORT: '/reports/fuel'
};

export const SETTINGS_TABS = [
	{
		value: 'organisation',
		label: 'Organisation'
	},
	{
		value: 'financial',
		label: 'Financial'
	}
]

export const SAMPLE_DRIVERS: Driver[] = [
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().unix(),
		driverId: `DRIVER-ID${alphanumericId(8)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		fullName: 'Chisom Oguibe',
		firstName: 'Chisom',
		lastName: 'Oguibe',
		email: 'chisom.oguibe@googlemail.com',
		defaultPhone: '+447523958055',
		primaryPhone: '+447523958055',
		secondaryPhone: '+447507210809',
		dob: 884505600,
		addressLine1: '250 Reede Road',
		addressLine2: '',
		city: 'Dagenham',
		postcode: 'RM10 8EH',
		companyName: 'HBCS Logistics',
		hireDate: moment().unix()
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().unix(),
		driverId: `DRIVER-ID${alphanumericId(8)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		fullName: "Ola Oladapo",
		firstName: 'Ola',
		lastName: 'Oladapo',
		email: 'ola.oladapo7@gmail.com',
		defaultPhone: '+447523958055',
		primaryPhone: '+447523958055',
		secondaryPhone: '+447507210809',
		dob: 884505600,
		addressLine1: '250 Reede Road',
		addressLine2: '',
		city: 'Dagenham',
		postcode: 'RM10 8EH',
		companyName: 'HBCS Logistics',
		hireDate: moment().unix()
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().unix(),
		driverId: `DRIVER-ID${alphanumericId(8)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		fullName: "Ryan Bannai",
		firstName: 'Rayan',
		lastName: 'Bannai',
		email: 'rayan.bannai@googlemail.com',
		defaultPhone: '+447523958055',
		primaryPhone: '+447523958055',
		secondaryPhone: '+447507210809',
		dob: 884505600,
		addressLine1: '250 Reede Road',
		addressLine2: '',
		city: 'Dagenham',
		postcode: 'RM10 8EH',
		companyName: 'HBCS Logistics',
		hireDate: moment().unix()
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().unix(),
		driverId: `DRIVER-ID${alphanumericId(8)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		fullName: "Oscar Sanz",
		firstName: 'Oscar',
		lastName: 'Sanz',
		email: 'oscar_sanz@hotmail.com',
		defaultPhone: '+447523958055',
		primaryPhone: '+447523958055',
		secondaryPhone: '+447507210809',
		dob: 884505600,
		addressLine1: '250 Reede Road',
		addressLine2: '',
		city: 'Dagenham',
		postcode: 'RM10 8EH',
		companyName: 'HBCS Logistics',
		hireDate: moment().unix()
	}
];

export const SAMPLE_TEAM: Member[] = [
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Chandler Moore',
		firstName: 'Chandler',
		lastName: 'Moore',
		email: 'chandler.moore@gmail.com',
		phone: '+447523958055',
		role: TeamRole.CONTROLLER,
		isActive: true
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Kendrick Lamar',
		firstName: 'Kendrick',
		lastName: 'Lamar',
		email: 'kendrick.lamar@hotmail.com',
		phone: '+447523958055',
		role: TeamRole.COORDINATOR,
		isActive: true
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Andy Mineo',
		firstName: 'Andy',
		lastName: 'Mineo',
		email: 'andy.mineo@gmail.com',
		phone: '+447523958052',
		role: TeamRole.SECRETARY,
		isActive: true
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Trip Lee',
		firstName: 'Trip',
		lastName: 'Lee',
		email: 'trip.leeboi@hotmail.com',
		phone: '+447523958056',
		role: TeamRole.FLEET_MANAGER,
		isActive: true
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Kanye West',
		firstName: 'Kanye',
		lastName: 'West',
		email: 'kanye.west@starlink.com',
		phone: '+447523923057',
		role: TeamRole.CONTROLLER,
		isActive: true
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		memberId: `USER-ID${alphanumericId(8)}`,
		fullName: 'Drake Aubrey Graham',
		firstName: 'Drake',
		lastName: 'Aubrey Graham',
		email: 'aubrey.graham@hiphopstudios.com',
		phone: '+44752392331',
		role: TeamRole.COORDINATOR,
		isActive: true
	}
];

export const SAMPLE_VEHICLES: Vehicle[] = [
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		currentDriver: `DRIVER-ID${alphanumericId(8)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `VEH-ID${alphanumericId(8)}`,
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		vehicleName: 'Mercedes Axor',
		make: 'Mercedes-Benz',
		model: 'Axor',
		dimensions: {
			length: 6867,
			width: 2487,
			height: 1440,
		},
		vin: '1G1YZ23J9P5803427',
		colour: 'Silver',
		fuelType: FuelType.PETROL,
		fuelMeasurementUnit: FuelMeasurementUnit.LITRE,
		engineNumber: '52WVC10338',
		image: 'https://www.mercedes-benz-trucks.com/content/dam/mbo/markets/en_ID/models/long-distance-actros/technical-data/specification-dimension/images/stage/stage-specification-dimension.jpg',
		notes: '',
		yearOfManufacture: "2011",
		status: VEHICLE_STATUS.FULL_CAPACITY
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		currentDriver: `DRIVER-ID${alphanumericId(8)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `VEH-ID${alphanumericId(8)}`,
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		vehicleName: 'Merceded Axor',
		make: 'Mercedes-Benz',
		model: 'Axor',
		dimensions: {
			length: 6867,
			width: 2487,
			height: 1440,
		},
		vin: '1G1YZ23J9P5803427',
		colour: 'Silver',
		fuelType: FuelType.PETROL,
		fuelMeasurementUnit: FuelMeasurementUnit.LITRE,
		engineNumber: '52WVC10338',
		image: 'https://www.mercedes-benz-trucks.com/content/dam/mbo/markets/en_ID/models/long-distance-actros/technical-data/specification-dimension/images/stage/stage-specification-dimension.jpg',
		notes: '',
		yearOfManufacture: "2011",
		status: VEHICLE_STATUS.IDLE
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		currentDriver: `DRIVER-ID${alphanumericId(8)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `VEH-ID${alphanumericId(8)}`,
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		vehicleName: 'Merceded Axor',
		make: 'Mercedes-Benz',
		model: 'Actros L',
		dimensions: {
			length: 6867,
			width: 2487,
			height: 1440,
		},
		vin: '1G1YZ23J9P5803427',
		colour: 'Silver',
		fuelType: FuelType.PETROL,
		fuelMeasurementUnit: FuelMeasurementUnit.LITRE,
		engineNumber: '52WVC10338',
		image: 'https://www.mercedes-benz-trucks.com/content/dam/mbo/markets/en_ID/models/long-distance-actros/technical-data/specification-dimension/images/stage/stage-specification-dimension.jpg',
		notes: '',
		yearOfManufacture: "2011",
		status: VEHICLE_STATUS.OCCUPIED
	},
	{
		id: '',
		userId: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		currentDriver: `DRIVER-ID${alphanumericId(8)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `VEH-ID${alphanumericId(8)}`,
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		vehicleName: 'Merceded Axor',
		make: 'Mercedes-Benz',
		model: 'Axor',
		dimensions: {
			length: 6867,
			width: 2487,
			height: 1440,
		},
		vin: '1G1YZ23J9P5803427',
		colour: 'Silver',
		fuelType: FuelType.PETROL,
		fuelMeasurementUnit: FuelMeasurementUnit.LITRE,
		engineNumber: '52WVC10338',
		image: 'https://www.mercedes-benz-trucks.com/content/dam/mbo/markets/en_ID/models/long-distance-actros/technical-data/specification-dimension/images/stage/stage-specification-dimension.jpg',
		notes: '',
		yearOfManufacture: "2011",
		status: VEHICLE_STATUS.ON_THE_ROAD
	}
]

export const SAMPLE_LOADS: Load[] = [
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID123',
		createdAt: moment().unix(),
		status: STATUS.PENDING,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 19000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(1, 'd').set('h', 8).unix(),
				end: moment().add(1, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(1, 'd').set('h', 18).unix(),
				end: moment().add(1, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	},
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID124',
		createdAt: moment().unix(),
		status: STATUS.DISPATCHED,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 14000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(2, 'd').set('h', 8).unix(),
				end: moment().add(2, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(2, 'd').set('h', 18).unix(),
				end: moment().add(2, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	},
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID125',
		createdAt: moment().unix(),
		status: STATUS.EN_ROUTE,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(3, 'd').set('h', 8).unix(),
				end: moment().add(3, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(3, 'd').set('h', 18).unix(),
				end: moment().add(3, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	},
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID127',
		createdAt: moment().unix(),
		status: STATUS.CANCELLED,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(4, 'd').set('h', 8).unix(),
				end: moment().add(4, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(4, 'd').set('h', 18).unix(),
				end: moment().add(4, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	},
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID128',
		createdAt: moment().unix(),
		status: STATUS.DISPATCHED,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(5, 'd').set('h', 8).unix(),
				end: moment().add(5, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(5, 'd').set('h', 18).unix(),
				end: moment().add(5, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	},
	{
		id: '',
		carrierId: '',
		source: 'Voyage',
		loadId: 'VOY-ID130',
		createdAt: moment().unix(),
		status: STATUS.COMPLETED,
		internalPONumber: 'PO 931-977981-8760',
		customerPONumber: 'PO 931-977981-8760',
		rate: 550.21,
		package: {
			weight: 15000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: '',
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrierInfo: {
			name: 'HBCS Logistics',
			driverId: SAMPLE_DRIVERS[0].driverId,
			driverName: SAMPLE_DRIVERS[0].fullName,
			driverPhone: SAMPLE_DRIVERS[0].defaultPhone,
			controllerId: SAMPLE_TEAM[0].memberId,
			controllerName: SAMPLE_TEAM[0].fullName,
			location: [-1.778197, 52.412811]
		},
		pickup: {
			street: "4 Cranbrook Way, Shirley",
			city: 'Shirley',
			region: 'Solihull',
			postcode: 'B90 4GT',
			country: 'UK',
			window: {
				start: moment().add(6, 'd').set('h', 8).unix(),
				end: moment().add(6, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			street: 'Noose Lane',
			city: 'Willenhall',
			postcode: 'WV13 3AR',
			country: 'UK',
			window: {
				start: moment().add(6, 'd').set('h', 18).unix(),
				end: moment().add(6, 'd').set('h', 20).unix()
			}
		},
		customer: {
			id: `CUSTOMER-ID${alphanumericId(8)}`,
			name: "",
			company: "ASOS"
		},
		driver: {
			id: `DRIVER-ID${alphanumericId(8)}`,
			name: "Chisom Oguibe",
			phone: "+447523958055"
		},
		vehicleType: VEHICLE_TYPES.FLATBED_TRAILER,
		trackingHistory: []
	}
];

/*export const SAMPLE_CUSTOMERS: Customer[] = [
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(7, 'day').unix(),
		customerId: `customer_${alphanumericId(8)}`,
		companyName: 'Addidas',
		fullName: 'John Smith',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.LARGE_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(6, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'ASOS',
		fullName: 'Michael Jackson',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.LARGE_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(5, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'BooHoo',
		fullName: 'Mr Bean',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.SMALL_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(4, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'TopMan',
		fullName: 'Daniel Craig',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.LARGE_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(3, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'UrbanWear',
		fullName: 'Black Adam',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.LARGE_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(2, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'Decathlon',
		fullName: 'Black Adam',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.SMALL_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	},
	{
		id: '',
		carrierId: '',
		createdAt: moment().subtract(1, 'day').unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		companyName: 'Nike',
		fullName: 'Black Adam',
		firstName: 'Black',
		lastName: 'Adam',
		email: 'black.adam@example.com',
		phone: '+447523958055',
		addressLine1: 'Frank G. Wells Building',
		addressLine2: '2nd Floor 500 South Buena Vista Street',
		city: 'Burbank',
		postcode: '91521',
		region: 'California',
		country: 'US',
		accountType: AccountType.MEDIUM_SHIPPER,
		billingEmail: 'onlinesupport@marvel.com.',
		extraContacts: [

		],
		taxIDNumber: '322-82-0578'
	}
]*/

export const SAMPLE_INVOICES = [
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2819',
		loadId: 'VOY-ID130',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2820',
		loadId: 'VOY-ID128',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.OVERDUE,
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2821',
		loadId: 'VOY-ID123',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2819',
		loadId: 'VOY-ID124',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2823',
		loadId: 'VOY-ID125',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.SHORT_PAID,
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2824',
		loadId: 'VOY-ID127',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.INVOICED,
	}
]
