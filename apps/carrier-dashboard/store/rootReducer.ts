import { combineReducers } from '@reduxjs/toolkit';
import profileReducer from './features/profileSlice';
import teamReducer from './features/memberSlice';
import driverReducer from './features/driverSlice';
import vehicleReducer from './features/vehicleSlice';
import customerReducer from './features/customerSlice';
import loadReducer from './features/loadSlice';
import shipmentReducer from './features/shipmentSlice';
import settingsReducer from './features/settingsSlice';
import documentReducer from './features/documentSlice';
import invoiceReducer from './features/invoiceSlice';
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
	invoices: invoiceReducer,
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
			invoices: action.payload.invoices || state.invoices,
		};
	}
	if (['LOGOUT', 'RESET'].includes(action.type)) {
		state = undefined;
	}
	return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer