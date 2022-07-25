import { combineReducers } from '@reduxjs/toolkit';

const appReducer = combineReducers({})

const rootReducer = (state, action) => {
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;