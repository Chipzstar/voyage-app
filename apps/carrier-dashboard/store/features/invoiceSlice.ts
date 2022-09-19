import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '@voyage-app/shared-types';
import axios from 'axios';

const initialState = [];

export const createInvoice = createAsyncThunk('invoice/createInvoice', async (payload: Partial<Invoice>, thunkAPI) => {
	try {
		const invoice = (await axios.post('/api/invoice', payload)).data;
		thunkAPI.dispatch(addInvoice(invoice));
		return invoice;
	} catch (err) {
		console.error(err?.response?.data);
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const invoiceSlice = createSlice({
	name: 'invoices',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setInvoices: (state, action: PayloadAction<Invoice[]>) => {
			return action.payload;
		},
		addInvoice: (state, action: PayloadAction<Invoice>) => {
			return [...state, action.payload];
		}
	}
});

export const useInvoices = (state): Invoice[] => state['invoices'];

export const { setInvoices, addInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;