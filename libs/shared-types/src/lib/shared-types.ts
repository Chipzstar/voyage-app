export interface SelectInputData {
	value: string;
	label: string
}

export type DateRange = [Date | null, Date | null]

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

export type Address = {
	line1: string;
	line2?: string;
	city: string;
	region?: string;
	postcode: string;
	country?: string;
};

export type Coordinates = [longitude: number, latitude: number]
//ENUMS

export enum STATUS {
	NEW = 'NEW',
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	DISPATCHED = 'DISPATCHED',
	AT_PICKUP = 'AT_PICKUP',
	LOADING = 'LOADING',
	EN_ROUTE = 'EN-ROUTE',
	AT_DROPOFF = 'AT_DROPOFF',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

export const STATUS_COLOUR = {
	[STATUS.NEW]: "#FF665C",
	[STATUS.PENDING]: "#9933CC",
	[STATUS.DISPATCHED]: "#FF7A00",
	[STATUS.EN_ROUTE]: "#4285F4",
	[STATUS.COMPLETED]: "#00FF19",
	[STATUS.CANCELLED]: "#565656",
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

export enum HAZMAT_TYPES {
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

export enum VEHICLE_TYPES {
	DRY_VAN = 'DRY_VAN',
	TAIL_LIFT = 'TAIL_LIFT',
	JUMBO_TRAILER = 'JUMBO_TRAILER',
	FLATBED_TRAILER = 'FLATBED_TRAILER',
	STEP_DECK_TRAILER = 'STEP_DECK_TRAILER',
	ARCTIC_TRUCK = 'ARCTIC_TRUCK',
	OTHER = 'OTHER'
}

export interface CarrierInfo {
	name: string;
	driverId: string;
	driverName: string;
	driverPhone: string;
	controllerId?: string;
	controllerName?: string;
	location?: Coordinates;
	vehicleId?: string
	vehicleType?: VEHICLE_TYPES | SHIPMENT_ACTIVITY;
}

export interface Shipment {
	id: string;
	shipperId: string;
	shipmentId: string;
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
	mileage?: number;
	pickup: Pickup;
	delivery: Delivery;
	packageInfo: Package;
	carrierInfo: Partial<CarrierInfo>;
	trackingHistory: Tracking[]

}

export interface Shipper {
	id: string;
	userId: string;
	shipperId: string;
	fullName: string;
	firstname: string;
	lastname: string;
	company: string;
	address: Address;
	phone: string;
	email: string;
	stripe: {
		customerId: string
		paymentMethod: {
			id: string;
			brand: string;
			fingerprint: string;
			last4: string;
			expMonth: string;
			expYear: string;
		}
	}
}

export interface LocationTimeWindow {
	h: number;
	m: number;
}

interface OperatingProps {
	isActive: boolean;
	open: LocationTimeWindow;
	close: LocationTimeWindow;
}
export enum LocationType {
	WAREHOUSE = 'WAREHOUSE',
	STORE = 'STORE',
	LASTMILE_CARRIER = 'LASTMILE_CARRIER'
}
// Define a type for the slice state


export interface OperatingHoursState {
	facility: OperatingProps;
}

export interface Location {
	id: string;
	locationId: string;
	shipperId: string;
	name: string;
	type: LocationType;
	addressLine1: string;
	addressLine2: string;
	city: string;
	postcode: string;
	region: string;
	country: string;
	pickupInstructions: string;
	deliveryInstructions: string;
	operatingHours: OperatingHoursState[];
}

export type Tracking = {
	status: STATUS;
	timestamp: UnixTimestamp;
};