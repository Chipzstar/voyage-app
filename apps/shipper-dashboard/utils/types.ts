export type UnixTimestamp = number

export interface CarrierQuote {
	quoteID: string,
	quantity: number,
	price: number
	rate: string
	timeWindow: string,
	carrier: string
}

export interface Quote {
	quoteID:string;
	quantity: number;
	price: number;
	rate: string;
	timeWindow: string;
	carrier: string;
	carrierQuotes: CarrierQuote
}

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

export type DateRange = [Date, Date]
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

export enum PACKAGE_TYPE {
	PALLET = 'PALLET',
	CRATE = 'CRATE',
	BOX = 'BOX',
	CONTAINER = 'CONTAINER',
	SKIDS = 'SKID',
}

export interface Carrier {
	name: string
	driverName: string,
	driverPhone: string,
	location?: Coordinates,
	vehicle?: string
}

export interface Shipment {
	id: string;
	shipmentId: string,
	createdAt: UnixTimestamp;
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

export interface LocationTimeWindow {
	h: number,
	m: number
}

interface OperatingProps {
	isActive: boolean;
	open: LocationTimeWindow;
	close: LocationTimeWindow;
}

export enum LocationType { WAREHOUSE= 'WAREHOUSE', STORE='STORE', LASTMILE_CARRIER='LASTMILE_CARRIER' }

// Define a type for the slice state
export interface OperatingHoursState {
	facility: OperatingProps
}

export interface Location {
	id: string,
	locationId: string,
	name: string,
	type: LocationType,
	addressLine1: string,
	addressLine2: string,
	city: string,
	postcode: string,
	region: string,
	country: string,
	pickupInstructions: string,
	deliveryInstructions: string,
	operatingHours: OperatingHoursState[]
}
