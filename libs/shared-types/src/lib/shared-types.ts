export interface SelectInputData {
	value: string;
	label: string
}

export type UnixTimestamp = number

export interface ShipmentTimeWindow {
	start: number;
	end: number;
}

export interface Pickup {
	facilityId: string,
	facilityName: string;
	location: string;
	window: ShipmentTimeWindow;
}

export interface Delivery {
	facilityId: string,
	facilityName: string;
	location: string;
	window?: ShipmentTimeWindow;
}

export interface Dimensions {
	length: number;
	width: number;
	height: number;
}

export interface Package {
	weight: number,
	quantity: number,
	dimensions: Dimensions,
	packageType: PACKAGE_TYPE,
	description: string,
}

//types
export type Coordinates = [longitude: number, latitude: number]

//ENUMS

export enum STATUS {
	NEW = 'NEW',
	PENDING = 'PENDING',
	DISPATCHED = 'DISPATCHED',
	AT_PICKUP = 'AT_PICKUP',
	LOADING = 'LOADING',
	EN_ROUTE = 'EN-ROUTE',
	AT_DROPOFF = 'AT_DROPOFF',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

export enum SERVICE_TYPE {
	WAREHOUSE_TO_WAREHOUSE = 'W2W',
	DIRECT_TO_STORE_DISTRIBUTION = 'D2S',
	DIRECT_TO_CARRIER_INJECTION = 'D2C'
}

export enum SHIPMENT_TYPE {
	FULL_TRUCK_LOAD = 'FTL',
	LESS_THAN_TRUCK_LOAD = 'LTL',
	LESS_THAN_PALLET_SIZE = 'LPS'
}

export enum SCHEDULING_TYPE {
	ONE_TIME = 'ONE_TIME',
	RECURRING = 'RECURRING'
}

export enum SHIPMENT_ACTIVITY {
	NO_PREFERENCE= 'NO_PREFERENCE',
	TAIL_LIFT = 'TAIL_LIFT',
	JUMBO_TRAILER = 'JUMBO_TRAILER',
	FLATBED_TRAILER = 'FLATBED_TRAILER'
}

export enum EQUIPMENT_TYPES {
	NO_PREFERENCE= 'NO_PREFERENCE',
	TAIL_LIFT = 'TAIL_LIFT',
	JUMBO_TRAILER = 'JUMBO_TRAILER',
	FLATBED_TRAILER = 'FLATBED_TRAILER'
}

export enum PACKAGE_TYPE {
	PALLET = 'PALLET',
	CRATE = 'CRATE',
	BOX = 'BOX',
	CONTAINER = 'CONTAINER',
	SKIDS = 'SKID',
}

enum HAZMAT_TYPES {
	NONE = 'none',
	EXPLOSIVES = 'Class 1: Explosives',
	GASES = 'Class 2: Gases',
	FLAMMABLE_LIQUIDS = 'Class 3: Flammable liquids',
	FLAMMABLE_SOLIDS = 'Class 4: Flammable solids',
	OXIDIZERS = 'Class 5: Oxidizers',
	TOXIC_SUBSTANCE = 'Class 6.1: Toxic substance',
	INFECTIOUS_SUBSTANCE = 'Class 6.2: Infectious Substance',
	RADIOACTIVE_MATERIAL = 'Class 7: Radioactive material',
	CORROSIVE_SUBSTANCE = 'Class 8: Corrosive material',
	MISC_DANGEROUS = 'Class 9: Miscellaneous dangerous goods'
}

export interface Carrier {
	name: string;
	driverId: string;
	driverName: string;
	driverPhone: string;
	controllerId?: string;
	controllerName?: string;
	location?: Coordinates;
	vehicleId?: string
	vehicleType?: string;
}

export interface Shipment {
	id: string;
	source: string;
	shipmentId: string,
	createdAt: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	bookingStatus: string;
	status: STATUS;
	serviceType: SERVICE_TYPE;
	shipmentType: SHIPMENT_TYPE;
	schedulingType: SCHEDULING_TYPE;
	activitiesRequired: SHIPMENT_ACTIVITY[];
	internalPONumber: string;
	customerPONumber: string;
	rate: number;
	pickup: Pickup;
	delivery: Delivery;
	package: Package;
	carrier: Carrier;
}

export interface Load {
	id: string;
	source: string;
	customer?: {
		id: string;
      name: string;
		company: string;
	},
	loadId: string,
	createdAt: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	status: STATUS;
	internalPONumber?: string;
	customerPONumber?: string;
	rate: number;
	pickup: {
		street: string;
		city: string;
      region?: string
		postcode: string;
		country: string;
		note?: string;
		window: ShipmentTimeWindow
	};
	delivery: {
		street: string;
		city: string;
		region?: string
		postcode: string;
		country: string;
		note?: string;
		window?: ShipmentTimeWindow
	};
	package: Package;
	carrier: Carrier;
	hazmat?: HAZMAT_TYPES
}

