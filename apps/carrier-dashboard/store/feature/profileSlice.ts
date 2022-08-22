import { BankAccountForm, Carrier } from '../../utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../index'
import axios from 'axios'

const initialState = {}

export const updateCarrier = createAsyncThunk('carrier/updateCarrier', async (payload: Carrier, thunkAPI) => {
	try {
		const carrier = (await axios.put(`/api/carrier/${payload.id}`, payload)).data;
		thunkAPI.dispatch(editCarrier(carrier));
		return carrier;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const createBankAccount = createAsyncThunk('carrier/createBankAccount', async (payload : BankAccountForm, thunkAPI) => {
	try {
		const { accountId, id, ...rest} = payload
		const carrier = (await axios.post(`/api/stripe/accounts/${accountId}/bank-account`, rest)).data;
		thunkAPI.dispatch(editCarrier(carrier));
		return carrier;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const updateBankDetails = createAsyncThunk('carrier/updateBankAccount', async (payload : BankAccountForm, thunkAPI) => {
	try {
		const { accountId, id, ...rest} = payload
		const carrier = (await axios.put(`/api/stripe/accounts/${accountId}/bank-account/${id}`, rest)).data;
		thunkAPI.dispatch(editCarrier(carrier));
		return carrier;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setCarrier: (state, action: PayloadAction<Carrier>) => {
			return action.payload;
		},
		editCarrier: (state, action: PayloadAction<Carrier>) => {
			return {
				...state,
				...action.payload
			}
		}
	}
})

export const useCarrier = (state: AppState) : Carrier => state['profile']

export const { setCarrier, editCarrier } = profileSlice.actions;

export default profileSlice.reducer;