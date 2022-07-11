import { combineReducers } from '@reduxjs/toolkit'
import operatingHoursReducer from './features/operatingHoursSlice';
import locationsReducer from './features/locationSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
	operatingHours: operatingHoursReducer,
	locations: locationsReducer
})

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
}

export type RootState = ReturnType<typeof rootReducer>

export default persistReducer(persistConfig, rootReducer);