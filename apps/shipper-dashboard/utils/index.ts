import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const PATHS = {
	HOME: '/',
	BOOKINGS: '/bookings',
	QUOTE: '/bookings/quote',
	SHIPMENTS: '/shipments',
	WORKFLOWS: '/workflows',
	BILLING: '/billing'
};

export const STATUSES = ['new', 'pending', 'dispatched', 'en-route', 'completed', 'cancelled'];

export const SAMPLE_QUOTES = [
	{
		quoteID: 'QTE123',
		quantity: 2,
		price: 12.01,
		rate: '#',
		timeWindow: '#',
		carrier: 'Carbon',
		carrierQuotes: [
			{
				quoteID: 'QTE124',
				quantity: 1,
				price: 12.19,
				rate: '#',
				timeWindow: '#',
				carrier: 'Cobley Transport'
			},
			{
				quoteID: 'QTE125',
				quantity: 1,
				price: 11.19,
				rate: '#',
				timeWindow: '#',
				carrier: 'D J Haulage'
			},
			{
				quoteID: 'QTE126',
				quantity: 1,
				price: 14.19,
				rate: '#',
				timeWindow: '#',
				carrier: 'Denham Haulage'
			}
		]
	},
	{ quoteID: 'QTE123', quantity: 2, price: 14.007, rate: '#', timeWindow: '#', carrier: 'Nitrogen' },
	{ quoteID: 'QTE123', quantity: 2, price: 88.906, rate: '#', timeWindow: '#', carrier: 'Yttrium' },
	{ quoteID: 'QTE123', quantity: 2, price: 137.33, rate: '#', timeWindow: '#', carrier: 'Barium' },
	{ quoteID: 'QTE123', quantity: 2, price: 140.12, rate: '#', timeWindow: '#', carrier: 'Cerium' }
];

export const SAMPLE_SHIPMENTS = [
	{
		shipmentID: 'VOY-ID123',
		status: 'new',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID124',
		status: 'dispatched',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID125',
		status: 'new',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID126',
		status: 'pending',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID127',
		status: 'en-route',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID128',
		status: 'new',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('17/06/22 21:37', 'DD/MM/YY HH:mm').format(),
				end: dayjs('18/06/22 21:37', 'DD/MM/YY HH:mm').format()
			}
		}
	}
];

export const SAMPLE_EVENTS = [
	{
		status: 'Shipment Accepted',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.'
	},
	{
		status: 'Shipment In Progress',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.'
	},
	{
		status: 'Shipment Completed',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.'
	}
]
