import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const SKYBOX_OPTIONS = [
    { label: 'Purply Blue Sky', file: 'PurplyBlueSky.png' },
    { label: 'Blue Sky', file: 'BlueSkySkybox.png' },
    { label: 'Green Sky', file: 'GreenSky.png' },
    { label: 'Purple Sky', file: 'SkySkybox.png' },
    { label: 'Sunset Sky', file: 'SunsetSky.png' },
] as const;

export const SHADOW_MAP_SIZES = [512, 1024, 2048, 4096] as const;
export const SHADOW_TYPES = [
    { label: 'Hard', value: 'basic' },
    { label: 'Soft', value: 'soft' },
] as const;
export const WATER_REFLECTION_SIZES = [64, 128, 256, 512] as const;

export interface RendererState {
    sceneLoaded: boolean;
    effectLoaded: boolean;

    // Lighting
    ambientLightIntensity: number;
    directionalLightIntensity: number;
    sunColor: string;
    sunAzimuth: number; // degrees 0-360
    sunElevation: number; // degrees 0-90

    // Shadow
    shadowType: 'basic' | 'soft';
    shadowMapSize: number;

    // Water
    waterReflectionSize: number;
    waterColor: string;
    waterFogEnabled: boolean;

    // Environment
    fogEnabled: boolean;

    // Post-processing
    vignetteEnabled: boolean;
    vignetteOffset: number;
    vignetteDarkness: number;
    depthOfFieldEnabled: boolean;
    dofFocalLength: number;
    dofBokehScale: number;
    chromaticAberrationEnabled: boolean;
    chromaticAberrationOffsetX: number;
    chromaticAberrationOffsetY: number;

    // Environment
    skybox: string;
    autoRotate: boolean;
    autoRotateSpeed: number;
}

const initialState: RendererState = {
    sceneLoaded: false,
    effectLoaded: false,

    // Lighting
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 0.7,
    sunColor: '#ffffff',
    sunAzimuth: 45,
    sunElevation: 63,

    // Shadow
    shadowType: 'soft',
    shadowMapSize: 2048,

    // Water
    waterReflectionSize: 128,
    waterColor: '#001e0f',
    waterFogEnabled: true,

    // Environment
    fogEnabled: true,

    // Post-processing
    vignetteEnabled: true,
    vignetteOffset: 0.4,
    vignetteDarkness: 0.5,
    depthOfFieldEnabled: true,
    dofFocalLength: 40,
    dofBokehScale: 1,
    chromaticAberrationEnabled: false,
    chromaticAberrationOffsetX: 0.002,
    chromaticAberrationOffsetY: 0.002,

    // Environment
    skybox: 'PurplyBlueSky.png',
    autoRotate: true,
    autoRotateSpeed: 1,
};

const rendererSlice = createSlice({
    name: 'renderer',
    initialState,
    reducers: {
        updateSceneLoaded: (state, action: PayloadAction<boolean>) => {
            state.sceneLoaded = action.payload;
        },
        updateEffectLoaded: (state, action: PayloadAction<boolean>) => {
            state.effectLoaded = action.payload;
        },
        updateAmbientLightIntensity: (state, action: PayloadAction<number>) => {
            state.ambientLightIntensity = action.payload;
        },
        updateDirectionalLightIntensity: (
            state,
            action: PayloadAction<number>
        ) => {
            state.directionalLightIntensity = action.payload;
        },
        updateSunColor: (state, action: PayloadAction<string>) => {
            state.sunColor = action.payload;
        },
        updateSunAzimuth: (state, action: PayloadAction<number>) => {
            state.sunAzimuth = action.payload;
        },
        updateSunElevation: (state, action: PayloadAction<number>) => {
            state.sunElevation = action.payload;
        },
        updateShadowType: (state, action: PayloadAction<'basic' | 'soft'>) => {
            state.shadowType = action.payload;
        },
        updateShadowMapSize: (state, action: PayloadAction<number>) => {
            state.shadowMapSize = action.payload;
        },
        updateWaterReflectionSize: (state, action: PayloadAction<number>) => {
            state.waterReflectionSize = action.payload;
        },
        updateWaterColor: (state, action: PayloadAction<string>) => {
            state.waterColor = action.payload;
        },
        updateVignetteEnabled: (state, action: PayloadAction<boolean>) => {
            state.vignetteEnabled = action.payload;
        },
        updateVignetteOffset: (state, action: PayloadAction<number>) => {
            state.vignetteOffset = action.payload;
        },
        updateVignetteDarkness: (state, action: PayloadAction<number>) => {
            state.vignetteDarkness = action.payload;
        },
        updateDepthOfFieldEnabled: (state, action: PayloadAction<boolean>) => {
            state.depthOfFieldEnabled = action.payload;
        },
        updateDofFocalLength: (state, action: PayloadAction<number>) => {
            state.dofFocalLength = action.payload;
        },
        updateDofBokehScale: (state, action: PayloadAction<number>) => {
            state.dofBokehScale = action.payload;
        },
        updateChromaticAberrationEnabled: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.chromaticAberrationEnabled = action.payload;
        },
        updateChromaticAberrationOffsetX: (
            state,
            action: PayloadAction<number>
        ) => {
            state.chromaticAberrationOffsetX = action.payload;
        },
        updateChromaticAberrationOffsetY: (
            state,
            action: PayloadAction<number>
        ) => {
            state.chromaticAberrationOffsetY = action.payload;
        },
        updateWaterFogEnabled: (state, action: PayloadAction<boolean>) => {
            state.waterFogEnabled = action.payload;
        },
        updateFogEnabled: (state, action: PayloadAction<boolean>) => {
            state.fogEnabled = action.payload;
        },
        updateSkybox: (state, action: PayloadAction<string>) => {
            state.skybox = action.payload;
        },
        updateAutoRotate: (state, action: PayloadAction<boolean>) => {
            state.autoRotate = action.payload;
        },
        updateAutoRotateSpeed: (state, action: PayloadAction<number>) => {
            state.autoRotateSpeed = action.payload;
        },
    },
});

export const {
    updateSceneLoaded,
    updateEffectLoaded,
    updateAmbientLightIntensity,
    updateDirectionalLightIntensity,
    updateSunColor,
    updateSunAzimuth,
    updateSunElevation,
    updateShadowType,
    updateShadowMapSize,
    updateWaterReflectionSize,
    updateWaterColor,
    updateVignetteEnabled,
    updateVignetteOffset,
    updateVignetteDarkness,
    updateDepthOfFieldEnabled,
    updateDofFocalLength,
    updateDofBokehScale,
    updateChromaticAberrationEnabled,
    updateChromaticAberrationOffsetX,
    updateChromaticAberrationOffsetY,
    updateWaterFogEnabled,
    updateFogEnabled,
    updateSkybox,
    updateAutoRotate,
    updateAutoRotateSpeed,
} = rendererSlice.actions;
export default rendererSlice.reducer;
