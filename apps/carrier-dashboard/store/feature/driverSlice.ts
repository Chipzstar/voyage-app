import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Driver } from '../../utils/types'
import axios from 'axios'
import { HYDRATE } from 'next-redux-wrapper'

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
		removeDriver: (state, action: PayloadAction<string>) => {
			return state.filter((driver) => driver.driverId !== action.payload)
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return action.payload.drivers ? action.payload.drivers : state
		}
	}
})

/*export const useDrivers = (state) : Driver[] => state['drivers']*/

export const useDrivers = (state) : Driver[] => {
	let drivers: Driver[] = state['drivers'];
	return [...drivers].sort((a, b) => b.createdAt - a.createdAt)
}

export const { setDrivers, addDriver, removeDriver } = driverSlice.actions;

export default driverSlice.reducer;