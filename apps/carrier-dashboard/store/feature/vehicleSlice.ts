import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_VEHICLES } from '../../utils/constants'
import { Driver, Vehicle } from '../../utils/types'
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
		setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
			return action.payload
		},
		addVehicle: (state, action: PayloadAction<Vehicle>) => {
			return [...state, action.payload];
		},
		removeVehicle: (state, action: PayloadAction<string>) => {
			return state.filter((v) => v.vehicleId !== action.payload);
		}
	}
});

// export const useVehicles = (state) : Vehicle[] => state['vehicles'];

export const useVehicles = (state) : Vehicle[] => {
	let vehicles: Vehicle[] = state['vehicles'];
	return [...vehicles].sort((a, b) => b.createdAt - a.createdAt)
};

export const { addVehicle, removeVehicle, setVehicles } = vehicleSlice.actions;

export default vehicleSlice.reducer;