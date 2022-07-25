import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shipment } from '../../utils/types';
import axios from 'axios';

const initialState = [];

export const createShipment = createAsyncThunk('shipment/createShipment', async (payload : Omit<Shipment, "id">, thunkAPI) => {
	try {
		console.log(payload)
		const result = (await axios.post(`/api/shipment/${payload.shipmentId}`, payload)).data
		console.log(result)
		return result
	} catch (err) {
	    console.error(err)
		thunkAPI.rejectWithValue(err.message)
	}
})

export const shipmentSlice = createSlice({
	name: 'shipments',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setShipments: (state, action: PayloadAction<Shipment[]>) => {
			return action.payload
		},
		addShipment: (state, action: PayloadAction<Shipment>) => {
			return [...state, action.payload];
		}
	}
});

export const selectAllShipments = state => state['shipments']

export const { setShipments, addShipment } = shipmentSlice.actions;

export default shipmentSlice.reducer;