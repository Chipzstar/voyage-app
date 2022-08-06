import {
	PACKAGE_TYPE,
	UnixTimestamp,
} from '@voyage-app/shared-types';

export enum TeamRole {
	ADMIN="admin",
	CONTROLLER="controller",
	SECRETARY="secretary",
	FLEET_MANAGER="fleet manager",
	COORDINATOR="coordinator"
}

export enum VEHICLE_STATUS {
	IDLE = "idle",
	OCCUPIED = "occupied",
	ON_THE_ROAD = "on-the-road",
	FULL_CAPACITY = "full-capacity",
}

export enum VEHICLE_TYPES {
	DRY_VAN='DRY_VAN',
	TAIL_LIFT = 'TAIL_LIFT',
	JUMBO_TRAILER = 'JUMBO_TRAILER',
	FLATBED_TRAILER = 'FLATBED_TRAILER',
	STEP_DECK_TRAILER = 'STEP_DECK_TRAILER',
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

export interface Driver {
	id: string;
	createdAt: UnixTimestamp;
	isActive: boolean;
	status: string;
	driverId: string;
	vehicleId?: string;
	dob?: UnixTimestamp;
	fullName: string;
	firstname: string;
	lastname: string;
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

export interface Team {
	id: string;
	createdAt: UnixTimestamp;
	memberId: string;
	fullName: string;
	firstname: string;
	lastname: string;
	email: string;
   phone: string;
	role: TeamRole;
	isActive: boolean;
}

export interface Vehicle {
	id: string;
	createdAt: UnixTimestamp;
	driverId: string;
	vehicleId: string;
	vehicleType: string;
   vehicleName: string;
	regNumber: string;
	vin: string;
	engineNumber: string;
	yearOfManufacture: string;
	colour: string;
	fuelType: FuelType;
	fuelMeasurementUnit: FuelMeasurementUnit
	image: string;
	dimensions: {
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
	createdAt: UnixTimestamp,
   customerId: string;
	accountType: AccountType;
	companyName: string;
	fullName: string;
	firstname?: string;
	lastname?: string;
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
	note?: string;
}

export interface NewBooking {
	createdAt: UnixTimestamp,
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
	vehicleType: VEHICLE_TYPES | "NO_PREFERENCE";
	description: string;
}
