import { PACKAGE_TYPE, SCHEDULING_TYPE, SERVICE_TYPE, SHIPMENT_ACTIVITY, SHIPMENT_TYPE } from '../../utils/types';

export interface NewBooking {
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