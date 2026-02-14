import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface RendererState {
    sceneLoaded: boolean;
    effectLoaded: boolean;
}
const rendererSlice = createSlice({
    name: 'renderer',
    initialState: {
        sceneLoaded: false,
        effectLoaded: false,
    } as RendererState,
    reducers: {
        updateSceneLoaded: (
            state: RendererState,
            action: PayloadAction<boolean>
        ) => {
            return { ...state, sceneLoaded: action.payload };
        },
        updateEffectLoaded: (
            state: RendererState,
            action: PayloadAction<boolean>
        ) => {
            return { ...state, effectLoaded: action.payload };
        },
    },
});

export const { updateSceneLoaded, updateEffectLoaded } = rendererSlice.actions;
export default rendererSlice.reducer;
