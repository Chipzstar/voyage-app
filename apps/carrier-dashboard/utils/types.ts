import {
	CarrierInfo,
	HAZMAT_TYPES,
	Package,
	PACKAGE_TYPE,
	ShipmentTimeWindow,
	STATUS,
	UnixTimestamp,
} from '@voyage-app/shared-types'

export enum TeamRole {
	ADMIN = 'ADMIN',
	CONTROLLER = 'CONTROLLER',
	SECRETARY = 'SECRETARY',
	FLEET_MANAGER = 'FLEET_MANAGER',
	COORDINATOR = 'COORDINATOR'
}

export enum VEHICLE_STATUS {
	IDLE = "IDLE",
	OCCUPIED = "OCCUPIED",
	ON_THE_ROAD = "ON_THE_ROAD",
	FULL_CAPACITY = "FULL_CAPACITY",
}

export enum VEHICLE_TYPES {
	DRY_VAN='DRY_VAN',
	TAIL_LIFT = 'TAIL_LIFT',
	JUMBO_TRAILER = 'JUMBO_TRAILER',
	FLATBED_TRAILER = 'FLATBED_TRAILER',
	STEP_DECK_TRAILER = 'STEP_DECK_TRAILER',
	ARCTIC_TRUCK = 'ARCTIC_TRUCK',
	OTHER= 'OTHER',
}

export enum FuelType {
	PETROL="PETROL",
	DIESEL="DIESEL",
	ELECTRIC="ELECTRIC",
	HYBRID="HYBRID",
	ALTERNATIVE="ALTERNATIVE",
}

export enum FuelMeasurementUnit {
	LITRE="LITRE",
	GALLON="GALLON",
}

export enum DRIVER_STATUS {
	OFFLINE="OFFLINE",
	AVAILABLE="AVAILABLE",
	BUSY="BUSY",
	UNVERIFIED="UNVERIFIED",
}

export enum INVOICE_STATUS {
	PAID="paid",
	OVERDUE="overdue",
	INVOICED="invoiced",
	SHORT_PAID="short-paid",
}

export enum AccountType {
	SMALL_SHIPPER="SMALL_SHIPPER",
	MEDIUM_SHIPPER="MEDIUM_SHIPPER",
	LARGE_SHIPPER="LARGE_SHIPPER",
}

export enum MapType {
	DASHBOARD,
	ORDER
}

export type Address = {
	addressLine1: string,
	addressLine2?: string,
   city: string,
	region?: string,
	postcode: string,
	country?: string,
}

type Stripe = {
	customerId: string,
	paymentMethodId: string,
}

type Tracking = {
	status: STATUS,
	timestamp: UnixTimestamp
}

type Geolocation = {
	type: "Point",
	coordinates: [number, number]
}

export enum DocumentType {
	UK_HGV_OPERATORS_LICENSE="UK_HGV_OPERATORS_LICENSE",
	GOODS_IN_TRANSIT_INSURANCE="GOODS_IN_TRANSIT_INSURANCE",
	LIABILITY_INSURANCE="LIABILITY_INSURANCE"
}

export interface CarrierDocument {
	type: DocumentType,
	document: {
		filename: string,
		location: string,
	}
}

export interface Carrier {
	id: string;
	carrierId: string;
	userId?: string;
	createdAt?: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	fullName: string;
	firstname: string;
	lastname: string;
	email: string;
	company: string;
	address: Address;
   phone: string;
	stripe?: Stripe;
	documents?: CarrierDocument
}

export enum ChargeUnitType {
	DISTANCE = 'DISTANCE',
	WEIGHT = 'WEIGHT',
	PACKAGE = 'PACKAGE'
}

type ChargeRule = {
	active: boolean;
	value: Number
}

export interface RateChargeRules {
	[ChargeUnitType.DISTANCE]: ChargeRule;
	[ChargeUnitType.WEIGHT]: ChargeRule
	[ChargeUnitType.PACKAGE]: ChargeRule
}

export interface Settings {
	id: string;
	carrierId: string;
	rateChargeRules: RateChargeRules
}

export interface Driver {
	id: string;
	carrierId: string;
	userId: string | unknown;
	createdAt: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	isActive: boolean;
	status: DRIVER_STATUS;
	driverId: string;
	vehicleId?: string;
	dob?: UnixTimestamp;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	companyName: string;
	defaultPhone: string;
	primaryPhone: string;
	secondaryPhone?: string;
	hireDate: UnixTimestamp;
	addressLine1: string;
	addressLine2: string;
	city: string;
	region?: string;
   postcode: string;
	fleetId?: string;
	notes?: string;
}

export interface Member {
	id: string;
	userId: string;
	carrierId: string;
	createdAt: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	memberId: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
   phone: string;
	role: TeamRole;
	isActive: boolean;
}

export interface Vehicle {
	id: string;
	userId: string | unknown;
	carrierId: string;
	createdAt: UnixTimestamp;
	vehicleId: string;
	currentDriver?: string;
	vehicleType: VEHICLE_TYPES;
   vehicleName: string;
	regNumber: string;
	vin: string;
	engineNumber?: string;
	yearOfManufacture?: string;
	colour?: string;
	fuelType: FuelType;
	fuelMeasurementUnit: FuelMeasurementUnit
	image?: string;
	dimensions?: {
		length: number;
		width: number;
		height: number;
	}
	make: string;
	model: string;
	notes?: string;
	status: VEHICLE_STATUS;
}

export interface Contact {
	name: string;
	email: string;
   phone: string;
	notes?: string;
}

export interface Customer {
	id: string;
	userId: string;
	carrierId: string;
	createdAt: UnixTimestamp,
   customerId: string;
	accountType: AccountType;
	companyName: string;
	fullName: string;
	firstName?: string;
	lastName?: string;
   email: string;
	phone: string;
	billingEmail: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	region?: string;
	postcode: string;
	country: string;
	taxIDNumber?: string;
	extraContacts: Contact[];
	notes?: string;
}

export interface Location {
	street: string;
	city: string;
   region?: string;
	postcode: string;
	country: string;
	lat?: number;
	lng?: number;
	note?: string;
}

export interface NewBooking {
	createdAt: UnixTimestamp,
	carrierId: string;
	internalPONumber?: string;
	customerPONumber?: string;
	weight: number;
	quantity: number;
	height: number;
	length: number;
	width: number;
	packageType: PACKAGE_TYPE;
	pickupDate?: any;
	pickupLocation: Location;
	deliveryLocation: Location;
	customerId: string;
	driverId: string;
	controllerId: string;
	vehicleType: VEHICLE_TYPES;
	description: string;
}

export interface LoadLocation {
	fullAddress?: string;
	street: string;
	city: string;
	region?: string;
	postcode: string;
	country: string;
	note?: string;
	location?: Geolocation
	window?: ShipmentTimeWindow;
}

export interface Load {
	id: string;
	carrierId: string;
	loadId: string;
	source: string;
	createdAt: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	status: STATUS;
	internalPONumber?: string;
	customerPONumber?: string;
	rate: number;
	pickup: LoadLocation;
	delivery: LoadLocation;
	customer?: {
		id: string;
		name: string;
		company: string;
	};
	driver?: {
		id: string;
		name: string;
		phone: string;
	};
	vehicleType: VEHICLE_TYPES
	package: Package;
	carrierInfo: CarrierInfo;
	hazmat?: HAZMAT_TYPES;
	trackingHistory: Tracking[]
}