import { combineReducers } from '@reduxjs/toolkit';
import teamReducer from './feature/memberSlice';
import driverReducer from './feature/driverSlice';

const appReducer = combineReducers({
	members: teamReducer,
	drivers: driverReducer
})

const rootReducer = (state, action) => {
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;