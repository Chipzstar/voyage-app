import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shipment, STATUS } from '@voyage-app/shared-types';
import axios from 'axios';

const initialState = [];

export const updateShipment = createAsyncThunk('shipment/updateShipment', async (payload : Partial<Shipment>, thunkAPI) => {
	try {
	    const { id, ...rest } = payload
		const shipment = (await axios.put(`/api/shipment/${id}`, rest)).data
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

export const useShipments = state => state['shipments']

export const useNewShipments = state => state['shipments'].filter((shipment: Shipment) => shipment.status === STATUS.NEW)

export const { setShipments, addShipment, editShipment } = shipmentSlice.actions;

export default shipmentSlice.reducer;