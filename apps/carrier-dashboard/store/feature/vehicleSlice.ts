import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../../utils/types'
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper'

const initialState = [];

export const createVehicle = createAsyncThunk('vehicle/createVehicle', async (payload: Partial<Vehicle>, thunkAPI) => {
	try {
		const vehicle = (await axios.post(`/api/vehicle/${payload.vehicleId}`, payload)).data;
		thunkAPI.dispatch(addVehicle(vehicle));
		return vehicle;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const deleteVehicle = createAsyncThunk('vehicle/deleteVehicle', async (payload: string, thunkAPI) => {
	try {
		const result = (await axios.delete(`/api/vehicle/${payload}`)).data;
		thunkAPI.dispatch(removeVehicle(payload));
		return result;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
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
			return state.filter((v) => v.id !== action.payload);
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return action.payload.vehicles ? action.payload.vehicles : state
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