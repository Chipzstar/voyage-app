import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shipment, STATUS } from '@voyage-app/shared-types';
import axios from 'axios';

const initialState = [];

export const getMarketplaceShipments = createAsyncThunk('shipment/getMarketplaceShipments', async (payload, thunkAPI) => {
	try {
		const shipments = (await axios.get('/api/shipment')).data
		thunkAPI.dispatch(setShipments(shipments))
		return shipments.filter(s => s.status === STATUS.NEW)
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const updateShipment = createAsyncThunk('shipment/updateShipment', async (payload : Partial<Shipment>, thunkAPI) => {
	try {
	    const { id, ...rest } = payload
		const shipment = (await axios.put(`/api/shipment/${id}`, rest)).data
		console.log(shipment)
		thunkAPI.dispatch(editShipment(shipment))
		return shipment
	} catch (err) {
		console.error(err?.response?.data)
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
		},
		editShipment: (state, action: PayloadAction<Shipment>) => {
			return state.map((s: Shipment) => s.id === action.payload.id ? action.payload : s)
		}
	}
});

export const useShipments = (state) : Shipment[] => state['shipments']

export const useNewShipments = (state) : Shipment[] => state['shipments'].filter((shipment: Shipment) => shipment.status === STATUS.NEW)

export const { setShipments, addShipment, editShipment } = shipmentSlice.actions;

export default shipmentSlice.reducer;