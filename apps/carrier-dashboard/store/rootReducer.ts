import { combineReducers } from '@reduxjs/toolkit';
import teamReducer from './feature/memberSlice';
import driverReducer from './feature/driverSlice';
import vehicleReducer from './feature/vehicleSlice';
import customerReducer from './feature/customerSlice';
import loadReducer from './feature/loadSlice';
import profileReducer from './feature/profileSlice';

const appReducer = combineReducers({
	profile: profileReducer,
	members: teamReducer,
	drivers: driverReducer,
	vehicles: vehicleReducer,
	customers: customerReducer,
	loads: loadReducer
})

const rootReducer = (state, action) => {
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;