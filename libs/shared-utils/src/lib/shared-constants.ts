import { customAlphabet } from 'nanoid';
import { STATUS } from '@voyage-app/shared-types';

export const alphanumericId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');
export const numericId = customAlphabet('1234567890');

export const intercomPlatform = {
	SHIPPER: 'Shipper Dashboard',
	CARRIER: 'Carrier Dashboard'
}

export const EVENT_DESCRIPTIONS = {
	[STATUS.NEW]: `Shipment has been created and awaiting for driver to accept`,
	[STATUS.PENDING]: 'Your drivers have been alerted about this new load',
	[STATUS.DISPATCHED]: 'Shipment has been accepted by the driver and heading to pickup',
	[STATUS.EN_ROUTE]: 'Driver has collected the shipment and is heading to the destination',
	[STATUS.COMPLETED]: 'Shipment has been delivered successfully',
	[STATUS.CANCELLED]: 'Shipment has been cancelled'
};

export const countries = [
	{
		code: 'AT',
		code3: 'AUT',
		name: 'Austria',
		number: '040',
		currency: 'EUR'
	},
	{ code: 'BE', code3: 'BEL', name: 'Belgium', number: '056', currency: 'EUR' },
	{ code: 'BG', code3: 'BGR', name: 'Bulgaria', number: '100', currency: 'EUR' },
	{ code: 'HR', code3: 'HRV', name: 'Croatia', number: '191', currency: 'EUR' },
	{
		code: 'CY',
		code3: 'CYP',
		name: 'Cyprus',
		number: '196',
		currency: 'EUR'
	},
	{ code: 'CZ', code3: 'CZE', name: 'Czech Republic', number: '203', currency: 'EUR' },
	{ code: 'DK', code3: 'DNK', name: 'Denmark', number: '208', currency: 'EUR' },
	{ code: 'EE', code3: 'EST', name: 'Estonia', number: '233', currency: 'EUR' },
	{ code: 'FI', code3: 'FIN', name: 'Finland', number: '246', currency: 'EUR' },
	{ code: 'FR', code3: 'FRA', name: 'France', number: '250', currency: 'EUR' },
	{ code: 'DE', code3: 'DEU', name: 'Germany', number: '276', currency: 'EUR' },
	{ code: 'GI', code3: 'GIB', name: 'Gibraltar', number: '292', currency: 'EUR' },
	{ code: 'GR', code3: 'GRC', name: 'Greece', number: '300', currency: 'EUR' },
	{ code: 'HU', code3: 'HUN', name: 'Hungary', number: '348', currency: 'EUR' },
	{ code: 'IE', code3: 'IRL', name: 'Ireland', number: '372', currency: 'EUR' },
	{ code: 'IT', code3: 'ITA', name: 'Italy', number: '380', currency: 'EUR' },
	{ code: 'LV', code3: 'LVA', name: 'Latvia', number: '428', currency: 'EUR' },
	{ code: 'LI', code3: 'LIE', name: 'Liechtenstein', number: '438', currency: 'EUR' },
	{ code: 'LT', code3: 'LTU', name: 'Lithuania', number: '440', currency: 'EUR' },
	{ code: 'LU', code3: 'LUX', name: 'Luxembourg', number: '442', currency: 'EUR' },
	{ code: 'MT', code3: 'MLT', name: 'Malta', number: '470', currency: 'EUR' },
	{ code: 'NL', code3: 'NLD', name: 'Netherlands', number: '528', currency: 'EUR' },
	{ code: 'NO', code3: 'NOR', name: 'Norway', number: '578', currency: 'EUR' },
	{ code: 'PL', code3: 'POL', name: 'Poland', number: '616', currency: 'EUR' },
	{ code: 'PT', code3: 'PRT', name: 'Portugal', number: '620', currency: 'EUR' },
	{ code: 'RO', code3: 'ROU', name: 'Romania', number: '642', currency: 'EUR' },
	{ code: 'SK', code3: 'SVK', name: 'Slovakia', number: '703', currency: 'EUR' },
	{ code: 'SI', code3: 'SVN', name: 'Slovenia', number: '705', currency: 'EUR' },
	{ code: 'ES', code3: 'ESP', name: 'Spain', number: '724', currency: 'EUR' },
	{ code: 'SE', code3: 'SWE', name: 'Sweden', number: '752', currency: 'EUR' },
	{ code: 'CH', code3: 'CHE', name: 'Switzerland', number: '756', currency: 'EUR' },
	{ code: 'GB', code3: 'GBR', name: 'United Kingdom', number: '826', currency: 'GBP' },
	{ code: 'US', code3: 'USA', name: 'United States', number: '840', currency: 'USD' }
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