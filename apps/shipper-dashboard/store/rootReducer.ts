import { combineReducers } from '@reduxjs/toolkit';
import locationsReducer from './features/locationSlice';
import shipmentsReducer from './features/shipmentsSlice';
import bookingsReducer from './features/bookingsSlice';
import { HYDRATE } from 'next-redux-wrapper';

const appReducer = combineReducers({
	locations: locationsReducer,
	shipments: shipmentsReducer,
	bookings: bookingsReducer,
})

const rootReducer = (state, action) => {
	if (action.type === HYDRATE) {
		return {
			...state, /// use previous state/// apply delta from hydration
			locations: action.payload.locations || state.locations,
			shipments: action.payload.shipments || state.shipments,
			bookings: action.payload.bookings || state.bookings
		}
	}
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;