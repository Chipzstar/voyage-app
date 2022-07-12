export interface CarrierQuote {
	quoteID: string,
	quantity: number,
	price: number
	rate: string
	timeWindow: string,
	carrier: string
}

export interface Quote {
	quoteID:string;
	quantity: number;
	price: number;
	rate: string;
	timeWindow: string;
	carrier: string;
	carrierQuotes: CarrierQuote
}

// Define a type for the slice state
export interface OperatingHoursState {
	shipping: OperatingProps
	receiving: OperatingProps
	facility: OperatingProps
}

interface OperatingProps {
	isActive: boolean;
	open: TimeWindow;
	close: TimeWindow;
}

export interface TimeWindow {
	h: number,
	m: number
}

export enum LocationType { WAREHOUSE= 'WAREHOUSE', STORE='STORE', LASTMILE_COURIER='LASTMILE_COURIER' }

export interface Location {
	id: string,
	name: string,
	type: LocationType,
	addressLine1: string,
	addressLine2: string,
	city: string,
	postcode: string,
	region: string,
	country: string,
	pickupInstructions: string,
	deliveryInstructions: string,
	operatingHours: OperatingHoursState[]
}
