import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SAMPLE_DRIVERS } from '../../utils/constants'
import { Driver } from '../../utils/types'
import axios from 'axios'

const initialState = SAMPLE_DRIVERS;

export const createDriver = createAsyncThunk('driver/createDriver', async (payload: Partial<Driver>, thunkAPI) => {
	try {
		const driver = (await axios.post(`/api/driver/${payload.driverId}`, payload)).data;
		thunkAPI.dispatch(addDriver(driver));
		return driver;
	} catch (err) {
		thunkAPI.rejectWithValue(err.message);
	}
});

export const driverSlice = createSlice({
	name: 'drivers',
	initialState,
	reducers: {
      addDriver: (state, action: PayloadAction<Driver>) => {
			return [...state, action.payload]
		}
	}
})

export const useDrivers = (state) : Driver[] => state['drivers']

export const { addDriver } = driverSlice.actions;

export default driverSlice.reducer;