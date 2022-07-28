import {
	PACKAGE_TYPE,
	SCHEDULING_TYPE,
	SERVICE_TYPE,
	SHIPMENT_ACTIVITY,
	SHIPMENT_TYPE,
	UnixTimestamp,
} from '@voyage-app/shared-types';

export interface NewBooking {
	id: string,
	createdAt: UnixTimestamp,
	serviceType: SERVICE_TYPE;
	shipmentType: SHIPMENT_TYPE;
	schedulingType: SCHEDULING_TYPE;
	activitiesRequired: SHIPMENT_ACTIVITY[];
	internalPONumber: string;
	customerPONumber: string;
	weight: number;
	quantity: number;
	height: number;
	length: number;
	width: number;
	packageType: PACKAGE_TYPE;
	pickupDate?: any;
	pickupLocation: string;
	deliveryLocation: string;
	description: string;
	notes: string;
}

export interface Driver {
	id: string;
	createdAt: UnixTimestamp;
	isActive: boolean;
	status: string;
	driverId: string;
	vehicleId?: string;
	dob?: UnixTimestamp;
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
   postcode: string;
	fleetId?: string;
	notes?: string;
}

export interface Team {
	id: string;
	memberId: string;
	firstname: string;
	lastname: string;
	email: string;
   phone: string;
	role: TeamRole;
	isActive: boolean;
}

export enum TeamRole {
	ADMIN="admin",
	CONTROLLER="controller",
	SECRETARY="secretary",
	FLEET_MANAGEER="fleet manager",
	COORDINATOR="coordinator"
}

export enum DRIVER_STATUS {
	OFFLINE="OFFLINE",
	AVAILABLE="AVAILABLE",
	BUSY="BUSY",
	UNVERIFIED="UNVERIFIED",
}