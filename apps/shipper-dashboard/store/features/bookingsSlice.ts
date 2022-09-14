import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../utils/types'
import axios from 'axios';

const initialState = [];

export const createBooking = createAsyncThunk('booking/createBooking', async (payload: Booking, thunkAPI) => {
	try {
		const booking = (await axios.post(`/api/booking/${payload.bookingId}`, payload)).data
		thunkAPI.dispatch(addBooking(booking))
		return booking
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const bookingSlice = createSlice({
	name: 'bookings',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setBookings: (state, action: PayloadAction<Booking[]>) => {
			return action.payload
		},
		addBooking: (state, action: PayloadAction<Booking>) => {
			return [...state, action.payload];
		}
	}
});

export const useBooking = (state) => state['bookings']

export const { setBookings, addBooking } = bookingSlice.actions;

export default bookingSlice.reducer;