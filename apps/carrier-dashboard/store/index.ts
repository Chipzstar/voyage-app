import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import rootReducer from './rootReducer';
import { createWrapper } from 'next-redux-wrapper'

export let store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production'
});

const makeStore = () => configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production'
});

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>

export const wrapper = createWrapper<AppStore>(makeStore);
/*
export default function getStore(incomingPreloadState?: RootState) {
	store = configureStore({
		reducer: rootReducer,
		devTools: process.env.NODE_ENV !== 'production',
		preloadedState: incomingPreloadState
	});
	return store;
}*/
