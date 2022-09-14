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

export const updateBooking = createAsyncThunk('booking/updateBooking', async (payload: Booking, thunkAPI) => {
	try {
		const { id, ...rest } = payload
		const booking = (await axios.put(`/api/booking/${id}`, rest)).data
		thunkAPI.dispatch(editBooking(booking))
		return booking
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
})

export const deleteBooking = createAsyncThunk('booking/deleteBooking', async (payload: String, thunkAPI) => {
	try {
		const booking = (await axios.delete(`/api/booking/${payload}`)).data
		thunkAPI.dispatch(removeBooking(payload))
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
		},
		editBooking: (state, action: PayloadAction<Booking>) => {
			return state.map(item => item.bookingId === action.payload.bookingId ? action.payload : item);
		},
		removeBooking: (state, action: PayloadAction<String>) => {
			return state.filter(item => item.id === action.payload)
		}
	}
});

export const useBooking = (state) => state['bookings']

export const { setBookings, addBooking, editBooking, removeBooking } = bookingSlice.actions;

export default bookingSlice.reducer;