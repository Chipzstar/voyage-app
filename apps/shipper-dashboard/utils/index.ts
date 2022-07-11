import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const PATHS = {
	HOME: '/',
	BOOKINGS: '/bookings',
	CREATE_BOOKING: '/bookings/create',
	BOOKING_CALENDAR: '/bookings/calendar',
	SHIPMENTS: '/shipments',
	WORKFLOWS: '/workflows',
	BILLING: '/billing',
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
		bookingStatus: "Booked",
		status: 'new',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID124',
		bookingStatus: "Booked",
		status: 'dispatched',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID125',
		bookingStatus: "Booked",
		status: 'new',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID126',
		bookingStatus: "Booked",
		status: 'pending',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID127',
		bookingStatus: "Booked",
		status: 'en-route',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
			}
		}
	},
	{
		shipmentID: 'VOY-ID128',
		bookingStatus: "Booked",
		status: 'new',
		pricePerKg: 5.56,
		rate: 550.21,
		carrier: 'HBCS Logistics',
		pickup: {
			facility: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: dayjs('22/07/22 08:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 09:00', 'DD/MM/YY HH:mm').format()
			}
		},
		delivery: {
			facility: 'Packfleet',
			location: 'South London',
			window: {
				start: dayjs('22/07/22 18:00', 'DD/MM/YY HH:mm').format(),
				end: dayjs('22/07/22 20:00', 'DD/MM/YY HH:mm').format()
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

export const DEFAULT_OPERATING_HOURS = [
	{
		shipping: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: true,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	},
	{
		shipping: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		receiving: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		},
		facility: {
			isActive: false,
			open: {
				h: 8,
				m: 0
			},
			close: {
				h: 18,
				m: 0
			}
		}
	}
]

/**
 * Converts a day number to a string.
 *
 * @param {Number} dayIndex
 * @return {String} Returns day as string
 */
export function dayOfWeekAsString(dayIndex) {
	return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
}
