import { configureStore } from '@reduxjs/toolkit';
import currentPageReducer from '@/states/slices/currentPageSlice';
import rendererReducer from '@/states/slices/rendererSlice';
import appReducer from '@/states/slices/appSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        currentPage: currentPageReducer,
        renderer: rendererReducer,
        app: appReducer,
    },
});

export default store;
