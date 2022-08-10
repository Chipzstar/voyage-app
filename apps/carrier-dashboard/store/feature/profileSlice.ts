import { Carrier } from '../../utils/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from '../index'

const initialState = {}

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setCarrier: (state, action: PayloadAction<Carrier>) => {
			return action.payload;
		}
	}
})

export const useCarrier = (state: AppState) : Carrier => state['profile']

export const { setCarrier } = profileSlice.actions;

export default profileSlice.reducer;