import { combineReducers } from '@reduxjs/toolkit';
import teamReducer from './feature/memberSlice';
import driverReducer from './feature/driverSlice';
import vehicleReducer from './feature/vehicleSlice';
import customerReducer from './feature/customerSlice';
import loadReducer from './feature/loadSlice';
import shipmentReducer from './feature/shipmentSlice';
import profileReducer from './feature/profileSlice';
import settingsReducer from './feature/settingsSlice';
import documentReducer from './feature/documentSlice';
import { HYDRATE } from 'next-redux-wrapper';

const appReducer = combineReducers({
	profile: profileReducer,
	members: teamReducer,
	drivers: driverReducer,
	vehicles: vehicleReducer,
	customers: customerReducer,
	loads: loadReducer,
	shipments: shipmentReducer,
	documents: documentReducer,
	settings: settingsReducer
});

const rootReducer = (state, action) => {
	if (action.type === HYDRATE) {
		return {
			...state, /// use previous state/// apply delta from hydration
			profile: {
				...state.profile,
				...action.payload.profile,
			},
			settings: {
				...state.settings,
				...action.payload.settings,
			},
			drivers: action.payload.drivers || state.drivers,
			members: action.payload.members || state.members,
			vehicles: action.payload.vehicles || state.vehicles,
			customers: action.payload.customers || state.customers,
			loads: action.payload.loads || state.loads,
			shipments: action.payload.shipments || state.shipments,
			documents: action.payload.documents || state.documents,
		};
	}
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer