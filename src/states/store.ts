import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '@/states/slices/todoSlice';
import currentPageReducer from '@/states/slices/currentPageSlice';
import rendererReducer from '@/states/slices/rendererSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        todos: todoReducer,
        currentPage: currentPageReducer,
        renderer: rendererReducer,
    },
});

export default store;
