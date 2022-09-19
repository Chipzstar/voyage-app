import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Driver } from '../../utils/types'
import axios from 'axios'

const initialState = [];

export const createDriver = createAsyncThunk('driver/createDriver', async (payload: Partial<Driver>, thunkAPI) => {
	try {
		const driver = (await axios.post(`/api/driver/${payload.driverId}`, payload)).data;
		thunkAPI.dispatch(addDriver(driver));
		return driver;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const updateDriver = createAsyncThunk('driver/updateDriver', async (payload: Partial<Driver>, thunkAPI) => {
	try {
		const driver = (await axios.put(`/api/driver/${payload.id}`, payload)).data;
		thunkAPI.dispatch(editDriver(driver));
		return driver;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const deleteDriver = createAsyncThunk('driver/deleteDriver', async (payload: string, thunkAPI) => {
	try {
		const result = (await axios.delete(`/api/driver/${payload}`)).data;
		thunkAPI.dispatch(removeDriver(payload));
		return result;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const driverSlice = createSlice({
	name: 'drivers',
	initialState,
	reducers: {
		setDrivers: (state, action: PayloadAction<Driver[]>) => {
			return action.payload;
		},
      addDriver: (state, action: PayloadAction<Driver>) => {
			return [...state, action.payload]
		},
		editDriver: (state, action: PayloadAction<Driver>) => {
			return state.map((d: Driver) => d.driverId === action.payload.driverId ? action.payload : d)
		},
		removeDriver: (state, action: PayloadAction<string>) => {
			return state.filter((d) => d.id !== action.payload)
		}
	}
})

export const useDrivers = (state) : Driver[] => {
	let drivers: Driver[] = state['drivers'];
	return [...drivers].sort((a, b) => b.createdAt - a.createdAt)
}

export const { setDrivers, addDriver, editDriver, removeDriver } = driverSlice.actions;

export default driverSlice.reducer;