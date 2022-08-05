import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Load } from '@voyage-app/shared-types';
import axios from 'axios';
import { SAMPLE_LOADS } from '../../utils/constants'

const initialState = SAMPLE_LOADS;

export const createLoad = createAsyncThunk('load/createLoad', async (payload : Omit<Load, "id">, thunkAPI) => {
	try {
		console.log(payload)
		const result = (await axios.post(`/api/load/${payload.loadId}`, payload)).data
		console.log(result)
		return result
	} catch (err) {
		console.error(err)
		thunkAPI.rejectWithValue(err.message)
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