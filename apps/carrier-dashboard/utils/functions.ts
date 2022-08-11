import React from 'react';
import { Customer, Driver, NewBooking, Member } from './types';
import { Load, STATUS } from '@voyage-app/shared-types';
import moment from 'moment/moment';
import { calculateRate, numericId } from '@voyage-app/shared-utils';
import { showNotification } from '@mantine/notifications';

export function generateLoad(values: NewBooking, drivers: Driver[], controllers: Member[], customers: Customer[]): Load {
	const pickup = {
		...values.pickupLocation,
		window: {
			start: moment(values.pickupDate).unix(),
			end: moment(values.pickupDate).add(1, 'hour').unix()
		}
	};
	const delivery = {
		...values.deliveryLocation
	};
	const driver = drivers.find(driver => driver.driverId === values.driverId);
	const controller = controllers.find(controller => controller.memberId === values.controllerId);
	const customer = customers.find(customers => customers.customerId === values.customerId);
	return {
		id: '',
		source: 'CUSTOMER',
		customer: {
			id: customer?.customerId,
			name: customer?.fullName,
			company: customer?.companyName
		},
		loadId: `VOY-ID${numericId(3)}`,
		createdAt: values.createdAt,
		status: STATUS.NEW,
		internalPONumber: values.internalPONumber,
		customerPONumber: values.customerPONumber,
		rate: calculateRate(values.weight, values.quantity),
		pickup,
		delivery,
		package: {
			weight: values.weight,
			quantity: values.quantity,
			dimensions: {
				height: values.height,
				width: values.width,
				length: values.length
			},
			packageType: values.packageType,
			description: values.description
		},
		carrier: {
			name: '',
			driverId: values.driverId,
			driverName: driver?.fullName,
			driverPhone: driver?.defaultPhone,
			controllerId: controller?.memberId,
			controllerName: controller?.firstName + ' ' + controller?.lastName,
			vehicleType: values.vehicleType
		}
	};
}

export function notifySuccess(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		disallowClose: true,
		onClose: () => console.log('unmounted'),
		onOpen: () => console.log('mounted'),
		autoClose: 3000,
		title: 'Success',
		message,
		color: 'green',
		icon,
		loading: false
	});
}

export function notifyError(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		disallowClose: true,
		onClose: () => console.log('unmounted'),
		onOpen: () => console.log('mounted'),
		autoClose: 3000,
		title: 'Error',
		message,
		color: 'red',
		icon,
		loading: false
	});
}
