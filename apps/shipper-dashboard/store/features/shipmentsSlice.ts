import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shipment } from '../../utils/types';

const initialState = [];

export const shipmentSlice = createSlice({
	name: 'shipments',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setShipments: (state, action: PayloadAction<Shipment[]>) => {
			return action.payload
		},
		createShipment: (state, action: PayloadAction<Shipment>) => {
			return [...state, action.payload];
		}
	}
});

export const selectAllShipments = state => state['shipments']

export const { setShipments, createShipment } = shipmentSlice.actions;

export default shipmentSlice.reducer;