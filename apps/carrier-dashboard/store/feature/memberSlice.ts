import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamRole } from '../../utils/types'
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper'

const initialState = [];

export const createMember = createAsyncThunk('member/createMember', async (payload: Partial<Team>, thunkAPI) => {
	try {
		const member = (await axios.post(`/api/member/${payload.memberId}`, payload)).data;
		thunkAPI.dispatch(addMember(member));
		return member;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const memberSlice = createSlice({
	name: 'members',
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<Team[]>) => {
			return action.payload
		},
		addMember: (state, action: PayloadAction<Team>) => {
			return [...state, action.payload];
		},
		editMember: (state, action: PayloadAction<{ id: string; data: Team }>) => {
			return state.map(member => (member.memberId === action.payload.id ? action.payload.data : member));
		},
		changeRole: (state, action: PayloadAction<{id: string, role: TeamRole}>) => {
			return state.map(member => {
				let clone = {...member}
				if (member.memberId === action.payload.id) {
					clone.role = action.payload.role;
				}
				return clone;
			});
		},
		removeMember: (state, action: PayloadAction<string>) => {
			return state.filter((member) => member.memberId !== action.payload)
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return action.payload.members ? action.payload.members : state
		}
	}
});

// export const useMembers = state => state['members']

export const useMembers = state => {
	let team: Team[] = state['members'];
	return [...team].sort((a, b) => b.createdAt - a.createdAt);
};

export const { addMember, changeRole, removeMember, setMembers } = memberSlice.actions;

export default memberSlice.reducer;
