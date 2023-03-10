import { BankAccountForm, Carrier, NewCarrier } from '../../utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../index'
import axios from 'axios'

const initialState = {}

export const createCarrier = createAsyncThunk('carrier/createCarrier', async (payload: NewCarrier, thunkAPI) => {
	try {
		const newCarrier = (await axios.post(`/api/carrier`, payload)).data
		thunkAPI.dispatch(setCarrier(newCarrier))
		return newCarrier
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

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
		const { accountId, ...rest} = payload
		console.log(rest)
		const carrier = (await axios.post(`/api/stripe/accounts/${accountId}/bank-account`, rest)).data;
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
		editCarrier: (state, action: PayloadAction<Partial<Carrier>>) => {
			return {
				...state,
				...action.payload
			}
		},
		saveNewCarrier: (state, action: PayloadAction<Partial<NewCarrier>>) => {
			return {
				...state,
				...action.payload
			}
		}
	}
})

export const useCarrier = (state: AppState) : Carrier => state['profile']

export const useNewCarrier = (state: AppState) : NewCarrier => state['profile']

export const { setCarrier, editCarrier, saveNewCarrier } = profileSlice.actions;

export default profileSlice.reducer;