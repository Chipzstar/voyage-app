import { combineReducers } from '@reduxjs/toolkit';
import locationsReducer from './features/locationSlice';
import shipmentsReducer from './features/shipmentsSlice';
import bookingsReducer from './features/bookingsSlice';

const appReducer = combineReducers({
	locations: locationsReducer,
	shipments: shipmentsReducer,
	bookings: bookingsReducer,
})

const rootReducer = (state, action) => {
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;