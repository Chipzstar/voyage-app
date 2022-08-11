import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Load } from '../../utils/types'

const initialState = [];

export const createLoad = createAsyncThunk('load/createLoad', async (payload : Partial<Load>, thunkAPI) => {
	try {
		const load = (await axios.post(`/api/load/${payload.loadId}`, payload)).data
		thunkAPI.dispatch(addLoad(load))
		return load
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const loadSlice = createSlice({
	name: 'loads',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setLoads: (state, action: PayloadAction<Load[]>) => {
			return action.payload
		},
		addLoad: (state, action: PayloadAction<Load>) => {
			return [...state, action.payload];
		}
	}
});

export const useLoads = (state): Load[] => state['loads']

export const { setLoads, addLoad } = loadSlice.actions;

export default loadSlice.reducer;