import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '@states/todoSlice';
import currentPageReducer from '@states/currentPageSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        todos: todoReducer,
        currentPage: currentPageReducer,
    },
});

export default store;
