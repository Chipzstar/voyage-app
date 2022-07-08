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
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID123',
		status: 'dispatched',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID123',
		status: 'new',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID123',
		status: 'pending',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID123',
		status: 'en-route',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID123',
		status: 'new',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs("17/06/22 21:37", "DD/MM/YY HH:mm").format(),
				end: dayjs("18/06/22 21:37", "DD/MM/YY HH:mm").format()
			}
		}
	}
]
