import { Address, CarrierInfo, HAZMAT_TYPES, LoadLocation, Package, PACKAGE_TYPE, SHIPMENT_ACTIVITY, STATUS, Tracking, UnixTimestamp, VEHICLE_TYPES } from '@voyage-app/shared-types';

export enum TeamRole {
	ADMIN = 'ADMIN',
	CONTROLLER = 'CONTROLLER',
	SECRETARY = 'SECRETARY',
	FLEET_MANAGER = 'FLEET_MANAGER',
	COORDINATOR = 'COORDINATOR'
}

export enum VEHICLE_STATUS {
	IDLE = 'IDLE',
	OCCUPIED = 'OCCUPIED',
	ON_THE_ROAD = 'ON_THE_ROAD',
	FULL_CAPACITY = 'FULL_CAPACITY'
}

export enum FuelType {
	PETROL = 'PETROL',
	DIESEL = 'DIESEL',
	ELECTRIC = 'ELECTRIC',
	HYBRID = 'HYBRID',
	ALTERNATIVE = 'ALTERNATIVE'
}

export enum FuelMeasurementUnit {
	LITRE = 'LITRE',
	GALLON = 'GALLON'
}

export enum DRIVER_STATUS {
	OFFLINE = 'OFFLINE',
	AVAILABLE = 'AVAILABLE',
	BUSY = 'BUSY',
	UNVERIFIED = 'UNVERIFIED'
}

export enum AccountType {
	SMALL_SHIPPER = 'SMALL_SHIPPER',
	MEDIUM_SHIPPER = 'MEDIUM_SHIPPER',
	LARGE_SHIPPER = 'LARGE_SHIPPER'
}

export enum MapType {
	DASHBOARD,
	ORDER
}

export enum ActivationStatus {
	COMPANY_INFO = 'COMPANY_INFO',
	BANK_ACCOUNT = 'BANK_ACCOUNT',
	WORKFLOWS = 'WORKFLOWS',
	DOCUMENTS = 'DOCUMENTS',
	COMPLETE = 'COMPLETE'
}

export interface BankAccount {
	id: string;
	country: string;
	fingerprint: string;
	currency: string;
	accountHolderName: string;
	last4: string;
	sortCode: string;
	status: string;
}

export type BankAccountForm = Omit<BankAccount, 'fingerprint' | 'status'> & { accountId: string };

export type StripeDetails = {
	accountId: string;
	paymentMethod?: {
		id: string;
		fingerprint: string;
		brand: string;
		expMonth: number;
		expYear: number;
		last4: string;
	};
	bankAccount?: BankAccount;
};

export enum DocumentType {
	UK_HGV_OPERATORS_LICENSE = 'UK_HGV_OPERATORS_LICENSE',
	GOODS_IN_TRANSIT_INSURANCE = 'GOODS_IN_TRANSIT_INSURANCE',
	LIABILITY_INSURANCE = 'LIABILITY_INSURANCE'
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
	stripe?: StripeDetails;
	status: ActivationStatus;
}

export enum ChargeUnitType {
	DISTANCE = 'DISTANCE',
	WEIGHT = 'WEIGHT',
	PACKAGE = 'PACKAGE'
}

type ChargeRule = {
	active: boolean;
	value: number;
};

export interface RateChargeRules {
	[ChargeUnitType.DISTANCE]: ChargeRule;
	[ChargeUnitType.WEIGHT]: ChargeRule;
	[ChargeUnitType.PACKAGE]: ChargeRule;
}

export interface Settings {
	id: string;
	carrierId: string;
	rateChargeRules: RateChargeRules;
}

export interface Driver {
	id: string;
	carrierId: string;
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
	carrierId: string;
	createdAt: UnixTimestamp;
	vehicleId: string;
	vehicleType: VEHICLE_TYPES;
	vehicleName: string;
	regNumber: string;
	vin: string;
	engineNumber?: string;
	yearOfManufacture?: string;
	colour?: string;
	fuelType: FuelType;
	fuelMeasurementUnit: FuelMeasurementUnit;
	image?: string;
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
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
	carrierId: string;
	createdAt: UnixTimestamp;
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

export interface BookingLocation {
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
	createdAt: UnixTimestamp;
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
	pickupLocation: BookingLocation;
	deliveryLocation: BookingLocation;
	customerId: string;
	driverId: string;
	controllerId: string;
	vehicleType: VEHICLE_TYPES;
	description: string;
}

export interface LoadCustomer {
	id: string;
	name: string;
	email?: string;
	company: string;
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
	mileage?: number;
	pickup: LoadLocation;
	delivery: LoadLocation;
	customer?: LoadCustomer;
	driver?: {
		id: string;
		name: string;
		phone: string;
	};
	vehicleType: VEHICLE_TYPES | SHIPMENT_ACTIVITY;
	packageInfo: Package;
	carrierInfo: CarrierInfo;
	hazmat?: HAZMAT_TYPES;
	trackingHistory: Tracking[];
}

export interface Document {
	id: string;
	carrierId: string;
	createdAt?: UnixTimestamp;
	updatedAt?: UnixTimestamp;
	type: DocumentType;
	filename: string;
	filepath: string;
	location: string;
	status: string;
	verified: boolean;
}

export interface NewCarrier {
	accountId: string;
	personId?: string;
	dob?: string;
	fullName: string;
	firstname: string;
	lastname: string;
	email: string;
	company: string;
	phone: string;
	jobTitle?: string;
	crn?: string;
	website?: string;
	password: string;
	confirmPassword: string;
	address: Address;
}

export interface NewBusinessMember {
	fullName: string;
	firstname: string;
	lastname: string;
	email: string;
	jobTitle: string;
	dob: string;
	address: Address;
}

export interface NewDocument {
	id: string;
	documentType: string;
	file: File | null;
}

export interface TabInfo {
	value: ActivationStatus;
	label: string;
	order: number;
	required: boolean;

}