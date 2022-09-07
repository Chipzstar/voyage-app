import { Shipper } from '@voyage-app/shared-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NewShipper } from '../../utils/types';
import { AppState } from '../index'
import axios from 'axios'

const initialState = {}

export const createShipper = createAsyncThunk('shipper/createShipper', async (payload: NewShipper, thunkAPI) => {
	try {
		const newShipper = (await axios.post(`/api/shipper`, payload)).data
		thunkAPI.dispatch(setShipper(newShipper))
		return newShipper
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const updateShipper = createAsyncThunk('shipper/updateShipper', async (payload: Shipper, thunkAPI) => {
	try {
		const shipper = (await axios.put(`/api/shipper/${payload.id}`, payload)).data;
		thunkAPI.dispatch(editShipper(shipper));
		return shipper;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setShipper: (state, action: PayloadAction<Shipper>) => {
			return action.payload;
		},
		editShipper: (state, action: PayloadAction<Partial<Shipper>>) => {
			return {
				...state,
				...action.payload
			}
		},
		saveNewShipper: (state, action: PayloadAction<Partial<NewShipper>>) => {
			return {
				...state,
				...action.payload
			}
		}
	}
})

export const useShipper = (state: AppState) : Shipper => state['profile']

export const useNewShipper = (state: AppState) : NewShipper => state['profile']

export const { setShipper, editShipper, saveNewShipper } = profileSlice.actions;

export default profileSlice.reducer;