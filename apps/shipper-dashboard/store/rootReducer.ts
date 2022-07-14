import { combineReducers } from '@reduxjs/toolkit';
import locationsReducer from './features/locationSlice';
import shipmentsReducer from './features/shipmentsSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const appReducer = combineReducers({
	locations: locationsReducer,
	shipments: shipmentsReducer
})

const rootReducer = (state, action) => {
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
}

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
}

export type RootState = ReturnType<typeof rootReducer>

export default persistReducer(persistConfig, rootReducer);