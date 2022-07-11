import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_OPERATING_HOURS } from '../../utils';

interface TimeWindow {
	h: number,
	m: number
}

interface OperatingProps {
	isActive: boolean;
	open: TimeWindow;
	close: TimeWindow;
}

// Define a type for the slice state
interface OperatingHoursState {
	shipping: OperatingProps
	receiving: OperatingProps
	facility: OperatingProps
}

// Define the initial state using that type
const initialState: OperatingHoursState[] = DEFAULT_OPERATING_HOURS

export const OperatingHoursSlice = createSlice({
	name: 'operatingHours',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		// Use the PayloadAction type to declare the contents of `action.payload`
		updateHours: (state, action: PayloadAction<any>) => {
			return state.map((item: OperatingHoursState, index: number) => {
				if (action.payload['index'] === index) {
					console.log(action.payload['value']);
					return action.payload['value']
				}
				return item;
			});
		},
	},
})

export const { updateHours } = OperatingHoursSlice.actions

export default OperatingHoursSlice.reducer