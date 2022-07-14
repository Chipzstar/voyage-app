import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_SHIPMENTS } from '../../utils/constants';
import { Shipment } from '../../utils/types';

const initialState = SAMPLE_SHIPMENTS

export const shipmentSlice = createSlice({
	name: 'shipments',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		createShipment: (state, action:PayloadAction<Shipment>) => {
			return [...state, action.payload]
		},
		updateShipment: (state, action:PayloadAction<Shipment>) => {
			return state.map(item => item.id === action.payload.id ? action.payload : item)
		},
		updateOperatingHours: (state, action: PayloadAction<any>) => {
			return state.map((item: Shipment, index: number) => {
				if (action.payload['index'] === index) {
					console.log(action.payload['value']);
					return { ...item, operatingHours: action.payload['value'] }
				}
				return item;
			});
		},
		deleteShipment: (state, action: PayloadAction<string>) => {
			return state.filter((item: Shipment) => item.id !== action.payload)
		}
	},
})

export const { createShipment, updateShipment, deleteShipment } = shipmentSlice.actions

export default shipmentSlice.reducer