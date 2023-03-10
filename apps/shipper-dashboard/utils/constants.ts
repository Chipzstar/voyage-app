import moment from 'moment';
import { OperatingHoursState } from '@voyage-app/shared-types';

export const DEBUG_MODE = process.env.NODE_ENV !== 'production';

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY
export const STRIPE_PUBLIC_KEY_PROD = "pk_live_51LXPkaEqdCHY4B77QHJ40Bo0S39Nbf3hmGXzQtbB9sHNywI3TtJntAYTCmIao99dRHj4AOJy55hUSxaGfTn0RvHt00pGvXRqic"
export const STRIPE_PUBLIC_KEY_STAGING = "pk_test_51LXPkaEqdCHY4B77SWShCyp3LDZXzgVCfNmIk9mvQfIHYZLOt9sLBFQN9af8EZDLimKj5sCTE3Y1vwkPR99fCYbq008YylFuKb"
export const STRIPE_PUBLIC_KEY_DEV = "pk_test_51LaOJhGDq1hax9m2x8Sr88iFO6OpMZll8TAkUORLrImT2gCarB5jAbka9vaFG7V4GJYEM6sHqWR0QOrP0iuni5US00eEkouX2X"

export const PUBLIC_PATHS = {
	LOGIN: '/login'
}

export const PATHS = {
	HOME: '/',
	BOOKINGS: '/bookings',
	CREATE_BOOKING: '/bookings/create',
	BOOKING_CALENDAR: '/bookings/calendar',
	SHIPMENTS: '/shipments',
	WORKFLOWS: '/workflows',
	BILLING: '/billing',
	NEW_LOCATION: '/location'
};

/*export const SAMPLE_SHIPMENTS: Shipment[] = [
	{
		id: 'VOY-ID123',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.PENDING,
		serviceType: SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 19000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(1, "d").set("h", 8).unix(),
				end: moment().add(1, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(1, "d").set("h", 18).unix(),
				end: moment().add(1, "d").set("h", 20).unix(),
			}
		}
	},
	{
		id: 'VOY-ID124',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.DISPATCHED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 14000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(2, "d").set("h", 8).unix(),
				end: moment().add(2, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(2, "d").set("h", 18).unix(),
				end: moment().add(2, "d").set("h", 20).unix(),
			}
		}
	},
	{
		id: 'VOY-ID125',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.EN_ROUTE,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.RECURRING,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(3, "d").set("h", 8).unix(),
				end: moment().add(3, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(3, "d").set("h", 18).unix(),
				end: moment().add(3, "d").set("h", 20).unix(),
			}
		}
	},
	{
		id: 'VOY-ID127',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.CANCELLED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.RECURRING,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(4, "d").set("h", 8).unix(),
				end: moment().add(4, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(4, "d").set("h", 18).unix(),
				end: moment().add(4, "d").set("h", 20).unix(),
			}
		}
	},
	{
		id: 'VOY-ID128',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.DISPATCHED,
		serviceType: SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION,
		shipmentType: SHIPMENT_TYPE.FULL_TRUCK_LOAD,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 9000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(5, "d").set("h", 8).unix(),
				end: moment().add(5, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(5, "d").set("h", 18).unix(),
				end: moment().add(5, "d").set("h", 20).unix(),
			}
		}
	},
	{
		id: 'VOY-ID130',
		createdAt: moment().unix(),
		bookingStatus: 'Booked',
		status: STATUS.COMPLETED,
		serviceType: SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE,
		shipmentType: SHIPMENT_TYPE.LESS_THAN_PALLET_SIZE,
		schedulingType: SCHEDULING_TYPE.ONE_TIME,
		activitiesRequired: [SHIPMENT_ACTIVITY.TAIL_LIFT],
		internalPONumber: "PO 931-977981-8760",
		customerPONumber: "PO 931-977981-8760",
		rate: 550.21,
		package: {
			weight: 15000,
			quantity: 1,
			packageType: PACKAGE_TYPE.PALLET,
			description: "",
			dimensions: {
				length: 90,
				width: 10,
				height: 120
			}
		},
		carrier: {
			name:'HBCS Logistics',
			driverName: 'Ben Award',
			driverPhone: '+447507210809',
			location: [-1.778197, 52.412811]
		},
		pickup: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Moved HQ',
			location: 'Solihull, Birmingham',
			window: {
				start: moment().add(6, "d").set("h", 8).unix(),
				end: moment().add(6, "d").set("h", 9).unix(),
			}
		},
		delivery: {
			facilityId: `facility_${nanoid(24)}`,
			facilityName: 'Packfleet',
			location: 'South London',
			window: {
				start: moment().add(6, "d").set("h", 18).unix(),
				end: moment().add(6, "d").set("h", 20).unix(),
			}
		}
	}
];*/

export const SAMPLE_HISTORY = [
	{
		status: 'Shipment Accepted',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
		timestamp: moment().subtract(2, 'hours').unix()
	},
	{
		status: 'Shipment In Progress',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
		timestamp: moment().subtract(90, 'minutes').unix()
	},
	{
		status: 'Shipment Completed',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
		timestamp: moment().subtract(1, 'hours').unix()
	}
];

export const SAMPLE_EVENTS = [
	{
		title: 'All Day Event very long title',
		bgColor: '#ff7f50',
		allDay: true,
		start: new Date(2022, 7, 0),
		end: new Date(2022, 7, 1)
	},
	{
		title: 'Long Event',
		start: new Date(2022, 7, 7),
		end: new Date(2022, 7, 10)
	},

	{
		title: 'DTS STARTS',
		bgColor: '#dc143c',
		start: new Date(2022, 2, 13, 0, 0, 0),
		end: new Date(2022, 2, 20, 0, 0, 0)
	},

	{
		title: 'DTS ENDS',
		bgColor: '#ff8c00',
		start: new Date(2022, 10, 6, 0, 0, 0),
		end: new Date(2022, 10, 13, 0, 0, 0)
	},

	{
		title: 'Some Event',
		bgColor: '#9932cc',
		start: new Date(2022, 7, 9, 0, 0, 0),
		end: new Date(2022, 7, 9, 0, 0, 0)
	},
	{
		title: 'Conference',
		bgColor: '#e9967a',
		start: new Date(2022, 7, 11),
		end: new Date(2022, 7, 13),
		desc: 'Big conference for important people'
	},
	{
		title: 'Meeting',
		bgColor: '#8fbc8f',
		start: new Date(2022, 7, 12, 10, 30, 0, 0),
		end: new Date(2022, 7, 12, 12, 30, 0, 0),
		desc: 'Pre-meeting meeting, to prepare for the meeting'
	},
	{
		title: 'Lunch',
		bgColor: '#cd5c5c',
		start: new Date(2022, 7, 12, 12, 0, 0, 0),
		end: new Date(2022, 7, 12, 13, 0, 0, 0),
		desc: 'Power lunch'
	},
	{
		title: 'Happy Hour',
		start: new Date(2022, 7, 12, 12, 0, 0, 0),
		end: new Date(2022, 7, 12, 13, 0, 0, 0),
		desc: 'Power lunch happy hour'
	},
	{
		title: 'Meeting',
		bgColor: '#da70d6',
		start: new Date(2022, 7, 12, 14, 0, 0, 0),
		end: new Date(2022, 7, 12, 15, 0, 0, 0)
	},
	{
		title: 'Happy Hour',
		bgColor: '#eee8aa',
		start: new Date(2022, 7, 17, 17, 0, 0, 0),
		end: new Date(2022, 7, 17, 17, 30, 0, 0),
		desc: 'Most important meal of the day'
	},
	{
		title: 'Dinner',
		bgColor: '#98fb98',
		start: new Date(2022, 7, 15, 20, 0, 0, 0),
		end: new Date(2022, 7, 15, 21, 0, 0, 0)
	},
	{
		title: 'Birthday Party',
		bgColor: '#afeeee',
		start: new Date(2022, 7, 13, 7, 0, 0),
		end: new Date(2022, 7, 13, 10, 30, 0)
	},
	{
		title: 'Birthday Party 2',
		bgColor: '#db7093',
		start: new Date(2022, 7, 13, 7, 0, 0),
		end: new Date(2022, 7, 13, 10, 30, 0)
	},
	{
		title: 'Birthday Party 7',
		bgColor: '#cd853f',
		start: new Date(2022, 7, 13, 7, 0, 0),
		end: new Date(2022, 7, 13, 10, 30, 0)
	},
	{
		title: 'Late Night Event',
		bgColor: '#b0e0e6',
		start: new Date(2022, 7, 17, 19, 30, 0),
		end: new Date(2022, 7, 18, 2, 0, 0)
	},
	{
		title: 'Multi-day Event',
		start: new Date(2022, 7, 20, 19, 30, 0),
		end: new Date(2022, 7, 22, 2, 0, 0)
	}
];

export let DEFAULT_OPERATING_HOURS : OperatingHoursState[] = [
	{
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
];

/*export const SAMPLE_LOCATIONS: Location[] = [
	{
		id: `location_${nanoid(16)}`,
		name: 'John Lewis Warehouse',
		type: LocationType.WAREHOUSE,
		addressLine1: '4 Cranbrook Way',
		addressLine2: 'Shirley',
		city: 'Solihull',
		postcode: 'B90 4GT',
		region: 'Birmingham',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'DHL Warehouse',
		type: LocationType.WAREHOUSE,
		addressLine1: '10 Stirling Rd',
		addressLine2: 'Shirley',
		city: 'Solihull',
		postcode: 'B90 4NE',
		region: 'Birmingham',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'Mountain Warehouse',
		type: LocationType.WAREHOUSE,
		addressLine1: 'Mell Square Shopping Centre',
		addressLine2: '8 Mill Ln',
		city: 'Solihull',
		postcode: 'B90 4GT',
		region: 'Birmingham',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'DRM2 Amazon Warehouse',
		type: LocationType.WAREHOUSE,
		addressLine1: '645 Oliver Rd',
		addressLine2: '',
		city: 'Romford',
		postcode: 'RM20 3AL',
		region: 'Grays',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'Boots Store',
		type: LocationType.STORE,
		addressLine1: '361 Oxford St',
		addressLine2: 'Shirley',
		city: 'London',
		postcode: 'W1C 2JL',
		region: 'London',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'adidas Flagship Store London',
		type: LocationType.STORE,
		addressLine1: '425 Oxford St',
		addressLine2: 'Shirley',
		city: 'London',
		postcode: 'W1C 2PG',
		region: 'London',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	},
	{
		id: `location_${nanoid(16)}`,
		name: 'Decathlon',
		type: LocationType.STORE,
		addressLine1: "Unit 6b Bugsby's Way",
		addressLine2: 'New Charlton',
		city: 'London',
		postcode: 'SE7 7ST',
		region: 'London',
		country: 'UK',
		pickupInstructions: '',
		deliveryInstructions: '',
		operatingHours: DEFAULT_OPERATING_HOURS
	}
];*/

interface User {
	email: string,
	password: string
}

export const users: User[] = [
	{ email: 'chisom@usevoyage.com', password: 'admin' },
	{ email: 'ola@usevoyage.com', password: 'admin' },
	{ email: 'rayan@usevoyage.com', password: 'admin' }
];

/**
 * Converts a day number to a string.
 *
 * @param {Number} dayIndex
 * @return {String} Returns day as string
 */
export function dayOfWeekAsString(dayIndex) {
	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex] || '';
}
