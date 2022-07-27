import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewBooking } from '../../utils/types'

const initialState = [];

export const bookingSlice = createSlice({
	name: 'bookings',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		createBooking: (state, action: PayloadAction<NewBooking>) => {
			return [...state, action.payload];
		}
	}
});

export const { createBooking } = bookingSlice.actions;

export default bookingSlice.reducer;