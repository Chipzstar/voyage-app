import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Location } from '@voyage-app/shared-types';

const initialState = [];

export const createLocation = createAsyncThunk('location/createLocation', async (payload: Partial<Location>, thunkAPI) => {
	try {
		console.log(payload)
		const location = (await axios.post(`/api/location/${payload.locationId}`, payload)).data;
		thunkAPI.dispatch(addLocation(location));
		return location;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const updateLocation = createAsyncThunk('location/updateLocation', async (payload: Location, thunkAPI) => {
	try {
		const { id, ...rest} = payload
		const location = (await axios.put(`/api/location/${id}`, rest)).data;
		thunkAPI.dispatch(editLocation(location));
		return location;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const deleteLocation = createAsyncThunk('location/deleteLocation', async (locationId: string, thunkAPI) => {
	try {
	    const result = (await axios.delete(`/api/location/${locationId}`)).data
		console.log(result)
		thunkAPI.dispatch(removeLocation(locationId))
		return result
	} catch (err) {
		thunkAPI.rejectWithValue(err.message);
	}
});

export const locationSlice = createSlice({
	name: 'locations',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setLocations: (state, action: PayloadAction<Location[]>) => {
			return action.payload;
		},
		addLocation: (state, action: PayloadAction<Location>) => {
			return [...state, action.payload];
		},
		editLocation: (state, action: PayloadAction<Location>) => {
			return state.map(item => item.locationId === action.payload.locationId ? action.payload : item);
		},
		updateOperatingHours: (state, action: PayloadAction<any>) => {
			return state.map((item: Location, index: number) => {
				if (action.payload['index'] === index) {
					console.log(action.payload['value']);
					return { ...item, operatingHours: action.payload['value'] };
				}
				return item;
			});
		},
		removeLocation: (state, action: PayloadAction<string>) => {
			return state.filter((item: Location) => item.id !== action.payload);
		}
	}
});

export const useLocation = (state) => state['locations']

export const { setLocations, addLocation, editLocation, removeLocation } = locationSlice.actions;

export default locationSlice.reducer;