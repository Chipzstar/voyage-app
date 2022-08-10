import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../utils/types';
import axios from 'axios';

const initialState = [];

export const createCustomer = createAsyncThunk('customer/createCustomer', async (payload: Partial<Customer>, thunkAPI) => {
	try {
		const customer = (await axios.post(`/api/customer/${payload.customerId}`, payload)).data;
		thunkAPI.dispatch(addCustomer(customer));
		return customer;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const customerSlice = createSlice({
	name: 'customers',
	initialState,
	reducers: {
		setCustomers: (state, action: PayloadAction<Customer[]>) => {
			return action.payload;
		},
		addCustomer: (state, action: PayloadAction<Customer>) => {
			return [...state, action.payload];
		},
		removeCustomer: (state, action: PayloadAction<string>) => {
			return state.filter((customer) => customer.customerId !== action.payload);
		}
	}
});

export const useCustomers = (state) : Customer[] => {
	let customers: Customer[] = state['customers'];
	return [...customers].sort((a, b) => b.createdAt - a.createdAt);
}

export const { setCustomers, addCustomer, removeCustomer } = customerSlice.actions;

export default customerSlice.reducer;