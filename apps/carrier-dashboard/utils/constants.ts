import moment from 'moment';
import { PACKAGE_TYPE, STATUS, VEHICLE_TYPES } from '@voyage-app/shared-types';
import { alphanumericId } from '@voyage-app/shared-utils';
import { ChargeUnitType, Driver, DRIVER_STATUS, FuelMeasurementUnit, FuelType, INVOICE_STATUS, Load, Member, RateChargeRules, Settings, SignupStatus, TeamRole, Vehicle, VEHICLE_STATUS } from './types';
import orderId from 'order-id';
import { momentLocalizer } from 'react-big-calendar';
import { PhoneNumberUtil } from 'google-libphonenumber';

moment.tz.setDefault('Europe/London');

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY || 'pk_test_51LXPkaEqdCHY4B77SWShCyp3LDZXzgVCfNmIk9mvQfIHYZLOt9sLBFQN9af8EZDLimKj5sCTE3Y1vwkPR99fCYbq008YylFuKb';

export const phoneUtil = PhoneNumberUtil.getInstance();

export const localizer = momentLocalizer(moment);

export const DEBUG_MODE = process.env.NODE_ENV !== 'production';

export const PUBLIC_PATHS = {
	LOGIN: '/login',
	SIGNUP: '/signup',
};

export const PATHS = {
	HOME: '/',
	MARKETPLACE: '/marketplace',
	FLEETS: '/fleets',
	ACCOUNTS: '/accounts',
	REPORTING: '/reports',
	SETTINGS: '/settings',
	TRIPS: '/trips',
	BOOK: '/trips/book',
	DRIVERS: '/fleets/drivers',
	NEW_DRIVER: '/fleets/drivers/create',
	TEAM: '/fleets/team',
	NEW_MEMBER: '/fleets/team/create',
	VEHICLES: '/fleets/vehicles',
	NEW_VEHICLE: '/fleets/vehicles/create',
	CUSTOMERS: '/accounts/customers',
	NEW_ACCOUNT: '/accounts/customers/create',
	PAYMENTS: '/accounts/payments',
	INVOICES: '/accounts/invoices',
	BASIC_REPORT: '/reports',
	FUEL_REPORT: '/reports/fuel'
};

export const SETTINGS_TABS = [
	{
		value: SignupStatus.COMPANY_INFO,
		label: 'Organisation'
	},
	{
		value: SignupStatus.WORKFLOWS,
		label: 'Workflows'
	},
	{
		value: SignupStatus.BANK_ACCOUNT,
		label: 'Financial'
	},
	{
		value: SignupStatus.DOCUMENTS,
		label: 'Documents'
	}
];

export const SAMPLE_INVOICES = [
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2819',
		loadId: 'VOY-ID130',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2820',
		loadId: 'VOY-ID128',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.OVERDUE
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2821',
		loadId: 'VOY-ID123',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2819',
		loadId: 'VOY-ID124',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.PAID
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2823',
		loadId: 'VOY-ID125',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.SHORT_PAID
	},
	{
		id: '',
		customerId: '',
		invoiceId: 'INV-ID2824',
		loadId: 'VOY-ID127',
		createdAt: moment().unix(),
		reference: orderId(process.env.SECRET).generate(),
		amountDue: 3412500,
		currency: 'GBP',
		dueDate: 1659098961,
		periodStart: 1661777361,
		periodEnd: 1661777361,
		total: 3412500,
		status: INVOICE_STATUS.INVOICED
	}
];

export const PLACE_TYPES = {
	ESTABLISHMENT: 'establishment',
	SUB_PREMISE: 'subpremise',
	PREMISE: 'premise',
	STREET_NUMBER: 'street_number',
	STREET_ADDRESS: 'route',
	CITY: 'postal_town',
	POSTCODE: 'postal_code',
	POSTCODE_PREFIX: 'postal_code_prefix',
	INTERSECTION: 'intersection'
};

export const defaultSettings: Settings = {
	id: null,
	carrierId: '',
	rateChargeRules: <RateChargeRules>{
		[ChargeUnitType.DISTANCE]: { active: true, value: 4.1 },
		[ChargeUnitType.WEIGHT]: { active: true, value: 0.02 },
		[ChargeUnitType.PACKAGE]: { active: true, value: 25.7 }
	}
};
