import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SAMPLE_LOCATIONS } from '../../utils';
import { Location } from '../../utils/types';

const initialState = SAMPLE_LOCATIONS

export const locationSlice = createSlice({
	name: 'locations',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		createLocation: (state, action:PayloadAction<Location>) => {
			return [...state, action.payload]
		},
		updateLocation: (state, action:PayloadAction<Location>) => {
			return state.map(item => item.id === action.payload.id ? action.payload : item)
		},
		updateOperatingHours: (state, action: PayloadAction<any>) => {
			return state.map((item: Location, index: number) => {
				if (action.payload['index'] === index) {
					console.log(action.payload['value']);
					return { ...item, operatingHours: action.payload['value'] }
				}
				return item;
			});
		}
	},
})

export const { createLocation, updateLocation, updateOperatingHours } = locationSlice.actions

export default locationSlice.reducer