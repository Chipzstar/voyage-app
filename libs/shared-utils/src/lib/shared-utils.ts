import { customAlphabet } from 'nanoid'

interface selectInput {
	value: string;
	label: string
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function calculateRate (weight, numPallets, miles=300){
	const sum = (weight * 0.02) + (numPallets * 25.7) + (miles * 4.5)
	return Number((sum / 3).toPrecision(2))
}

export function uniqueArray(array: selectInput[], key) {
	return [...new Map(array.map(item => [item[key], item])).values()];
}

export const alphanumericId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

export const numericId = customAlphabet('1234567890');