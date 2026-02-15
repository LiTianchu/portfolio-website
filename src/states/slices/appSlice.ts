import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    isMobile: boolean;
}
const appSlice = createSlice({
    name: 'app',
    initialState: {
        isMobile: false,
    } as AppState,
    reducers: {
        updateIsMobile: (state: AppState, action: PayloadAction<boolean>) => {
            return { ...state, isMobile: action.payload };
        },
    },
});

export const { updateIsMobile } = appSlice.actions;
export default appSlice.reducer;
