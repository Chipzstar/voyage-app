import moment from 'moment';
import { ActivationStatus, ChargeUnitType, RateChargeRules, Settings, TabInfo } from './types';
import orderId from 'order-id';
import { momentLocalizer } from 'react-big-calendar';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Invoice, INVOICE_STATUS } from '@voyage-app/shared-types';
import { alphanumericId } from '@voyage-app/shared-utils';

moment.tz.setDefault('Europe/London');

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY;

export const phoneUtil = PhoneNumberUtil.getInstance();

export const localizer = momentLocalizer(moment);

export const DEBUG_MODE = process.env.NODE_ENV !== 'production';
console.log('DEBUG MODE = ' + DEBUG_MODE);

export const PUBLIC_PATHS = {
	LOGIN: '/login',
	SIGNUP: '/signup'
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

export const SETTINGS_TABS: TabInfo[] = [
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

export const SAMPLE_INVOICES: Invoice[] = [
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.OVERDUE,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.OVERDUE,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	},
	{
		id: alphanumericId(12),
		carrierId: '',
		createdAt: moment().unix(),
		invoiceId: `INV-${orderId(process.env.SECRET).generate()}`,
		items: [
			{
				itemId: 'VOY-ID130',
				type: 'Load',
				periodStart: 1663171566,
				periodEnd: 1663517166,
				amountDue: 341200
			}
		],
		currency: 'GBP',
		dueDate: 1659098961,
		total: 3412500,
		status: INVOICE_STATUS.PAID,
		billingInfo: {
			name: 'Ben Franklin',
			company: 'HBCS Logistics',
			email: 'ben.franklin@gmail.com',
			phone: '+11234567890'
		},
		pdfLocation: ''
	}
];

export const defaultSettings: Settings = {
	id: null,
	carrierId: '',
	rateChargeRules: <RateChargeRules>{
		[ChargeUnitType.DISTANCE]: { active: true, value: 4.1 },
		[ChargeUnitType.WEIGHT]: { active: true, value: 0.02 },
		[ChargeUnitType.PACKAGE]: { active: true, value: 25.7 }
	}
};
