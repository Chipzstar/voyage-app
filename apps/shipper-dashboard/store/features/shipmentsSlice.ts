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
		deleteShipment: (state, action: PayloadAction<string>) => {
			return state.filter((item: Shipment) => item.id !== action.payload)
		}
	},
})

export const { createShipment, deleteShipment } = shipmentSlice.actions

export default shipmentSlice.reducer