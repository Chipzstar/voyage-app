import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_CUSTOMERS } from '../../utils/constants';
import { Customer } from '../../utils/types';
import axios from 'axios';

const initialState = SAMPLE_CUSTOMERS;

export const createCustomer = createAsyncThunk('customer/createCustomer', async (payload: Partial<Customer>, thunkAPI) => {
	try {
		const customer = (await axios.post(`/api/customer/${payload.customerId}`, payload)).data;
		thunkAPI.dispatch(addCustomer(customer));
		return customer;
	} catch (err) {
		thunkAPI.rejectWithValue(err.message);
	}
});

export const customerSlice = createSlice({
	name: 'customers',
	initialState,
	reducers: {
		addCustomer: (state, action: PayloadAction<Customer>) => {
			return [...state, action.payload];
		}
	}
});

export const useCustomers = (state) : Customer[] => {
	let customers: Customer[] = state['customers'];
	return [...customers].sort((a, b) => b.createdAt - a.createdAt);
}

/*export const useCustomers = (state) : Customer[] => state['customers']*/

export const { addCustomer } = customerSlice.actions;

export default customerSlice.reducer;