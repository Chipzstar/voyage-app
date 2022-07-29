import moment from 'moment'
import {
	EQUIPMENT_TYPES,
	PACKAGE_TYPE,
	SCHEDULING_TYPE,
	SERVICE_TYPE,
	Shipment,
	SHIPMENT_ACTIVITY,
	SHIPMENT_TYPE,
	STATUS,
} from '@voyage-app/shared-types'
import { alphanumericId } from '@voyage-app/shared-utils'
import { customAlphabet } from 'nanoid'
import {
	AccountType,
	Customer,
	Driver,
	DRIVER_STATUS,
	FuelMeasurementUnit,
	FuelType,
	Team,
	TeamRole,
	Vehicle,
	VEHICLE_STATUS,
} from './types'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzACBCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');

export const PUBLIC_PATHS = {
	LOGIN: '/login'
};

export const PATHS = {
	HOME: '/',
	MARKETPLACE: '/marketplace',
	FLEETS: '/fleets',
	ACCOUNTS: '/accounts',
	REPORTING: '/report',
	SETTINGS: '/settings',
	TRIPS: '/trips',
	BOOK: '/trips/book',
	DRIVERS: '/fleets/drivers',
	NEW_DRIVER: '/fleets/drivers/create',
	FUEL_REPORT: '/report#fuel',
	TEAM: '/fleets/team',
	NEW_MEMBER: '/fleets/team/create',
	VEHICLES: '/fleets/vehicles',
	NEW_VEHICLE: '/fleets/vehicles/create',
	CUSTOMERS: '/accounts/customers',
	NEW_ACCOUNT: '/accounts/customers/create',
	PAYMENTS: '/accounts/payments',
	INVOICE: '/accounts/invoice',
	BASIC_REPORT: '/report#basic',


};

const pickupFacilityId = `facility_${nanoid(24)}`;
const deliveryFacilityId = `facility_${nanoid(24)}`;

export const SAMPLE_LOADS: Shipment[] = [
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID123',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.PENDING,
		serviceType: SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Ola Oladapo',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(1, 'd').set('h', 8).unix(),
				end: moment().add(1, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(1, 'd').set('h', 18).unix(),
				end: moment().add(1, 'd').set('h', 20).unix()
			}
		}
	},
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID124',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.DISPATCHED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Chisom Oguibe',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(2, 'd').set('h', 8).unix(),
				end: moment().add(2, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(2, 'd').set('h', 18).unix(),
				end: moment().add(2, 'd').set('h', 20).unix()
			}
		}
	},
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID125',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.EN_ROUTE,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.RECURRING,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Rayan Bannai',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(3, 'd').set('h', 8).unix(),
				end: moment().add(3, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(3, 'd').set('h', 18).unix(),
				end: moment().add(3, 'd').set('h', 20).unix()
			}
		}
	},
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID127',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.CANCELLED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.RECURRING,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Ola Oladapo',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(4, 'd').set('h', 8).unix(),
				end: moment().add(4, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(4, 'd').set('h', 18).unix(),
				end: moment().add(4, 'd').set('h', 20).unix()
			}
		}
	},
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID128',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.DISPATCHED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Ola Oladapo',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(5, 'd').set('h', 8).unix(),
				end: moment().add(5, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(5, 'd').set('h', 18).unix(),
				end: moment().add(5, 'd').set('h', 20).unix()
			}
		}
	},
	{
		id: '',
		source: 'Voyage',
		shipmentId: 'VOY-ID130',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.COMPLETED,
		serviceType: SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE,
		shipmentType: SHIPMENT_TYPE.LESS_THAN_PALLET_SIZE,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
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
		controller: {
			name: 'Ola Oladapo',
			phone: '+447523958055'
		},
		carrier: {
			name: 'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: pickupFacilityId,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(6, 'd').set('h', 8).unix(),
				end: moment().add(6, 'd').set('h', 9).unix()
			}
		},
		delivery: {
			facilityId: deliveryFacilityId,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(6, 'd').set('h', 18).unix(),
				end: moment().add(6, 'd').set('h', 20).unix()
			}
		}
	}
];

export const SAMPLE_DRIVERS: Driver[] = [
	{
		id: '',
		createdAt: moment().unix(),
		driverId: `driver_${alphanumericId(16)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		firstname: 'Chisom',
		lastname: 'Oguibe',
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
		createdAt: moment().unix(),
		driverId: `driver_${alphanumericId(16)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		firstname: 'Ola',
		lastname: 'Oladapo',
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
		createdAt: moment().unix(),
		driverId: `driver_${alphanumericId(16)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		firstname: 'Rayan',
		lastname: 'Bannai',
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
		createdAt: moment().unix(),
		driverId: `driver_${alphanumericId(16)}`,
		status: DRIVER_STATUS.OFFLINE,
		isActive: false,
		firstname: 'Oscar',
		lastname: 'Sanz',
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

export const SAMPLE_TEAM: Team[] = [
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Omari',
		lastname: 'Obrian',
		email: 'daniel.obrian@gmail.com',
		phone: '+447523958055',
		role: TeamRole.ADMIN,
		isActive: true
	},
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Kendrick',
		lastname: 'Lamar',
		email: 'kendrick.lamar@hotmail.com',
		phone: '+447523958055',
		role: TeamRole.COORDINATOR,
		isActive: true
	},
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Andy',
		lastname: 'Mineo',
		email: 'andy.mineo@gmail.com',
		phone: '+447523958052',
		role: TeamRole.SECRETARY,
		isActive: true
	},
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Trip',
		lastname: 'Lee',
		email: 'trip.leeboi@hotmail.com',
		phone: '+447523958056',
		role: TeamRole.FLEET_MANAGER,
		isActive: true
	},
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Kanye',
		lastname: 'West',
		email: 'kanye.west@starlink.com',
		phone: '+447523923057',
		role: TeamRole.CONTROLLER,
		isActive: true
	},
	{
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		firstname: 'Drake',
		lastname: 'Aubrey',
		email: 'aubrey.graham@hiphopstudios.com',
		phone: '+44752392331',
		role: TeamRole.COORDINATOR,
		isActive: true
	}
];

export const SAMPLE_VEHICLES: Vehicle[] = [
	{
		id: '',
		driverId: `driver_${alphanumericId(16)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `vehicle_${alphanumericId(16)}`,
		vehicleType: EQUIPMENT_TYPES.FLATBED_TRAILER,
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
		yearOfManufacture: 2011,
		status: VEHICLE_STATUS.FULL_CAPACITY
	},
	{
		id: '',
		driverId: `driver_${alphanumericId(16)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `vehicle_${alphanumericId(16)}`,
		vehicleType: EQUIPMENT_TYPES.FLATBED_TRAILER,
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
		yearOfManufacture: 2011,
		status: VEHICLE_STATUS.IDLE
	},
	{
		id: '',
		driverId: `driver_${alphanumericId(16)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `vehicle_${alphanumericId(16)}`,
		vehicleType: EQUIPMENT_TYPES.FLATBED_TRAILER,
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
		yearOfManufacture: 2011,
		status: VEHICLE_STATUS.OCCUPIED
	},
	{
		id: '',
		driverId: `driver_${alphanumericId(16)}`,
		regNumber: 'BD5I SMR',
		vehicleId: `vehicle_${alphanumericId(16)}`,
		vehicleType: EQUIPMENT_TYPES.FLATBED_TRAILER,
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
		yearOfManufacture: 2011,
		status: VEHICLE_STATUS.ON_THE_ROAD
	}
]

export const SAMPLE_CUSTOMERS: Customer[] = [
	{
		id: '',
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
	},{
		id: '',
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
		customerId: `customer_${alphanumericId(16)}`,
		companyName: 'Marvel Cinematic Universe',
		fullName: 'Black Adam',
		firstname: 'Black',
		lastname: 'Adam',
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
]
