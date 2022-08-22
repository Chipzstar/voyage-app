import moment from 'moment';

interface selectInput {
	value: string;
	label: string;
}

export enum ChargeUnitType {
	DISTANCE = 'DISTANCE',
	WEIGHT = 'WEIGHT',
	PACKAGE = 'PACKAGE'
}
// functions
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function sanitize(str: string): string {
	return str.replace(/[_-]/g, ' ').toLowerCase();
}

export function calculateRate(
	weight,
	numPallets,
	miles = 300,
	rates = {
		DISTANCE: { active: true, value: 4.5 },
		WEIGHT: { active: true, value: 0.02 },
		PACKAGE: { active: true, value: 25.7 }
	}
) {
	let total = Object.entries(rates).reduce((prev, [key, rate]) => {
		let newVal = prev
		if (!rate.active) return prev;
		switch (key) {
			case ChargeUnitType.DISTANCE:
				newVal += (miles * rate.value)
				console.log("New value:", newVal)
				return newVal
			case ChargeUnitType.WEIGHT:
				newVal += (weight * rate.value)
				console.log("New value:", newVal)
				return newVal
			case ChargeUnitType.PACKAGE:
				newVal += (weight * numPallets * rate.value)
				console.log("New value:", newVal)
				return newVal
			default:
				return prev;
		}
	}, 0);
	// const sum = weight * rates.WEIGHT.value + numPallets * rates.PACKAGE.value + miles * rates.DISTANCE.value;
	return Number((total / 3).toPrecision(2));
}

export function uniqueArray(array: selectInput[], key) {
	return [...new Map(array.map(item => [item[key], item])).values()];
}

export function getYears(amount: number): string[] {
	return [...Array(amount).keys()].map(pos => moment().subtract(pos, 'y').year().toString());
}

export function sortByDate(data, order = 'desc') {
	order === 'desc' ? data.sort((a, b) => b['createdAt'] - a['createdAt']) : data.sort((a, b) => a['createdAt'] - b['createdAt']);
	return data;
}

export function includesCaseInsensitive(this: string, str: string): boolean {
	return this.toLowerCase().includes(str.toLowerCase());
}