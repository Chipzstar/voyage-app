import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_LOCATIONS } from '../../utils';
import { Location } from '../../utils/types';

const initialState = SAMPLE_LOCATIONS

export const locationSlice = createSlice({
	name: 'locations',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addNew: (state, action:PayloadAction<Location>) => {
			return [...state, action.payload]
		}
		// Use the PayloadAction type to declare the contents of `action.payload`
	},
})

export const { addNew } = locationSlice.actions

export default locationSlice.reducer