import moment from 'moment';
import { ChargeUnitType, INVOICE_STATUS, RateChargeRules, Settings, ActivationStatus, TabInfo } from './types';
import orderId from 'order-id';
import { momentLocalizer } from 'react-big-calendar';
import { PhoneNumberUtil } from 'google-libphonenumber';

moment.tz.setDefault('Europe/London');

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY

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

export const SETTINGS_TABS : TabInfo[] = [
	{
		value: ActivationStatus.COMPANY_INFO,
		label: 'Organisation',
		order: 1,
		required: true
	},
	{
		value: ActivationStatus.DOCUMENTS,
		label: 'Documents',
		order: 2,
		required: true
	},
	{
		value: ActivationStatus.WORKFLOWS,
		label: 'Workflows',
		order: 3,
		required: true
	},
	{
		value: ActivationStatus.BANK_ACCOUNT,
		label: 'Financial',
		order: 4,
		required: false

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
