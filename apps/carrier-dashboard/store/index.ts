import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export let store = configureStore({
	reducer: rootReducer,
	devTools: true
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default function getStore(incomingPreloadState?: RootState) {
	store = configureStore({
		reducer: rootReducer,
		devTools: true,
		preloadedState: incomingPreloadState
	});
	return store;
}