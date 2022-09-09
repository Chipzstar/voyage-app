import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member, TeamRole } from '../../utils/types';
import axios from 'axios';

const initialState = [];

export const createMember = createAsyncThunk('member/createMember', async (payload: Partial<Member>, thunkAPI) => {
	try {
		const member = (await axios.post(`/api/member/${payload.memberId}`, payload)).data;
		thunkAPI.dispatch(addMember(member));
		return member;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const updateMember = createAsyncThunk('customer/updateMember', async (payload: Partial<Member>, thunkAPI) => {
	try {
		const member = (await axios.put(`/api/member/${payload.id}`, payload)).data;
		thunkAPI.dispatch(editMember(member));
		return member;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const deleteMember = createAsyncThunk('member/deleteMember', async (payload: string, thunkAPI) => {
	try {
		const result = (await axios.delete(`/api/member/${payload}`)).data;
		thunkAPI.dispatch(removeMember(payload));
		return result;
	} catch (err) {
		console.error(err?.response?.data)
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const memberSlice = createSlice({
	name: 'members',
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<Member[]>) => {
			return action.payload
		},
		addMember: (state, action: PayloadAction<Member>) => {
			return [...state, action.payload];
		},
		editMember: (state, action: PayloadAction<Member>) => {
			return state.map((m: Member) => m.memberId === action.payload.memberId ? action.payload : m)
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
			return state.filter((m) => m.id !== action.payload)
		}
	}
});

// export const useMembers = state => state['members']

export const useMembers = state => {
	let team: Member[] = state['members'];
	return [...team].sort((a, b) => b.createdAt - a.createdAt);
};

export const useControllers = state => {
	let team: Member[] = state['members'];
	return [...team].filter(m => m.role === TeamRole.CONTROLLER).sort((a, b) => b.createdAt - a.createdAt)
}

export const { addMember, changeRole, editMember, removeMember, setMembers } = memberSlice.actions;

export default memberSlice.reducer;
