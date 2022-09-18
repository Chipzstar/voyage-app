import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shipment } from '@voyage-app/shared-types';
import axios from 'axios';

const initialState = [];

export const getShipments = createAsyncThunk('shipment/getShipments', async (payload, thunkAPI) => {
	try {
		const shipments = (await axios.get('/api/shipment')).data
		thunkAPI.dispatch(setShipments(shipments))
		return shipments
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const createShipment = createAsyncThunk('shipment/createShipment', async (payload : Shipment, thunkAPI) => {
	try {
		const shipment = (await axios.post(`/api/shipment/${payload.shipmentId}`, payload)).data
		thunkAPI.dispatch(addShipment(shipment))
		return shipment
	} catch (err) {
		console.error(err)
		return thunkAPI.rejectWithValue(err?.response?.data);
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

export const useShipments = (state): Shipment[] => state['shipments']

export const { setShipments, addShipment } = shipmentSlice.actions;

export default shipmentSlice.reducer;