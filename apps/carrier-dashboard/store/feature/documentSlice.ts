import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document, NewDocument } from '../../utils/types';
import axios from 'axios';

const initialState = [];

export const createDocument = createAsyncThunk('document/createDocument', async (payload: NewDocument, thunkAPI) => {
	try {
		const document = (
			await axios.post('/api/document', {
				type: payload.documentType,
				filename: payload.file.name,
				filepath: `${payload.id}/${payload.documentType}/${payload.file.name}`,
				status: 'PENDING',
				verified: false
			})
		).data;
		thunkAPI.dispatch(addDocument(document));
		return document;
	} catch (err) {
		console.error(err?.response?.data);
		return thunkAPI.rejectWithValue(err?.response?.data);
	}
});

export const documentSlice = createSlice({
	name: 'documents',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setDocuments: (state, action: PayloadAction<Document[]>) => {
			return action.payload;
		},
		addDocument: (state, action: PayloadAction<Document>) => {
			return [...state, action.payload];
		}
	}
});

export const useDocuments = (state): Document[] => state['documents'];

export const { setDocuments, addDocument } = documentSlice.actions;

export default documentSlice.reducer;