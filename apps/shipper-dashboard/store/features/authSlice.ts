import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	authenticated: false,
	user: null
};

export const loginUser = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
	const resp = await axios.post('/api/auth/user', payload)
	console.log("CLIENT", resp.data)
	return resp.data;
});

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticate: ((state, action) => {
			console.log(action.payload);
			return { ...state, authenticated: true, user: action.payload };
		})
	},
	extraReducers: (builder) => {
		builder.addCase(loginUser.fulfilled, (state, action) => {
			console.log('Login Success!');
			return { ...state };
		});
	}
});

export const { authenticate } = authSlice.actions;

export default authSlice.reducer;