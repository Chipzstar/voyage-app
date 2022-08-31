import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { createWrapper } from 'next-redux-wrapper';
import { DEBUG_MODE } from '../utils/constants';

export let store = configureStore({
	reducer: rootReducer,
	devTools: DEBUG_MODE
});

const initStore = () => configureStore({
	reducer: rootReducer,
	devTools: DEBUG_MODE
});

export type AppStore = ReturnType<typeof initStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>

export const wrapper = createWrapper<AppStore>(initStore);
/*
export default function getStore(incomingPreloadState?: RootState) {
	store = configureStore({
		reducer: rootReducer,
		devTools: true,
		preloadedState: incomingPreloadState
	});
	return store;
}*/
