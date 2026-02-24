import { configureStore } from '@reduxjs/toolkit';
import currentPageReducer from '@/states/slices/currentPageSlice';
import rendererReducer from '@/states/slices/rendererSlice';
import appReducer from '@/states/slices/appSlice';
import type { Middleware } from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const logger: Middleware = (store) => (next) => (action) => {
    const prevState = store.getState();

    console.log('Previous State:', prevState);
    const result = next(action);

    console.log('Action Dispatched:', action);
    const nextState = store.getState();
    console.log('Next State:', nextState);

    return result;
};

const store = configureStore({
    reducer: {
        currentPage: currentPageReducer,
        renderer: rendererReducer,
        app: appReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
