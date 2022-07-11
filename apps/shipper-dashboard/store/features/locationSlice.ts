import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = []

export const locationSlice = createSlice({
	name: 'locations',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addNew: (state, action) => {
			return [...state, { name: "Dagenham", postcode: "RM10 8EH"}]
		}
		// Use the PayloadAction type to declare the contents of `action.payload`
	},
})

export const { addNew } = locationSlice.actions

export default locationSlice.reducer