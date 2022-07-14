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

export type Coordinates = [longitude: number, latitude: number]
//ENUMS

export enum STATUS {
	NEW = 'new',
	PENDING = 'pending',
	DISPATCHED = 'dispatched',
	EN_ROUTE = 'en-route',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled'
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
	ONE_TIME = 'one-time',
	RECURRING = 'recurring'
}

export enum SHIPMENT_ACTIVITY {
	TAIL_LIFT = 'tail-lift',
	LUTON_VAN = 'luton-van',
	FLATBED_TRAILER = 'flatbed-trailer'
}

export enum PACKAGE_TYPE {
	PALLET = 'pallet',
	CRATE = 'crate',
	BOX = 'box',
	CONTAINER = 'container',
	SKIDS = 'skid',
}

export interface Carrier {
	name: string
	driverName: string,
	driverPhone: string,
	location: Coordinates,
	vehicle: string
}

export interface Shipment {
	id: string;
	bookingStatus: string;
	status: string;
	serviceType: SERVICE_TYPE;
	shipmentType: SHIPMENT_TYPE;
	schedulingType: SCHEDULING_TYPE;
	activitiesRequired: SHIPMENT_ACTIVITY[];
	internalPONumber: string;
	customerPONumber: string;
	rate: number;
	pickup: Pickup;
	delivery: Delivery;
	package: Package
	carrier: Carrier,
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

export enum LocationType { WAREHOUSE= 'WAREHOUSE', STORE='STORE', LASTMILE_COURIER='LASTMILE_COURIER' }

// Define a type for the slice state
export interface OperatingHoursState {
	shipping: OperatingProps
	receiving: OperatingProps
	facility: OperatingProps
}

export interface Location {
	id: string,
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