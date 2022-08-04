import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_VEHICLES } from '../../utils/constants'
import { Vehicle } from '../../utils/types';
import axios from 'axios';

const initialState = SAMPLE_VEHICLES;

export const createVehicle = createAsyncThunk('vehicle/createVehicle', async (payload: Partial<Vehicle>, thunkAPI) => {
	try {
		const vehicle = (await axios.post(`/api/vehicle/${payload.vehicleId}`, payload)).data;
		thunkAPI.dispatch(addVehicle(vehicle));
		return vehicle;
	} catch (err) {
		thunkAPI.rejectWithValue(err.message);
	}
});

export const vehicleSlice = createSlice({
	name: 'vehicles',
	initialState,
	reducers: {
		addVehicle: (state, action: PayloadAction<Vehicle>) => {
			return [...state, action.payload];
		}
	}
});

export const useVehicles = (state) : Vehicle[] => state['vehicles'];

export const { addVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;