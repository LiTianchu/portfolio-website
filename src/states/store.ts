import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '@states/todoSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
});

export default store;
