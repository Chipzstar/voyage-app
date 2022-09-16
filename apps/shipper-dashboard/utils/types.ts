import {
	Address,
	PACKAGE_TYPE,
	SCHEDULING_TYPE,
	SERVICE_TYPE,
	SHIPMENT_ACTIVITY,
	SHIPMENT_TYPE,
	ShipperStripe
} from '@voyage-app/shared-types';

export type UnixTimestamp = number;

export interface Booking {
	id: string;
	shipperId: string;
	bookingId: string;
	createdAt?: UnixTimestamp;
	updatedAt?: UnixTimestamp;
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
	pickupDate?: number;
	pickupLocation: string;
	deliveryLocation: string;
	description: string;
	status: string;
	notes: string;
}

export interface NewShipper {
	fullName: string;
	firstname: string;
	lastname: string;
	email: string;
	company: string;
	phone: string;
	password: string;
	confirmPassword: string;
	address: Address;
	stripe?: ShipperStripe
}