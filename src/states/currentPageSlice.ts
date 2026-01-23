import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const currentPageSlice = createSlice({
    name: 'currentPage',
    initialState: 0,
    reducers: {
        changePage: (_: number, action: PayloadAction<number>) => {
            return action.payload;
        },
    },
});

export const { changePage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
