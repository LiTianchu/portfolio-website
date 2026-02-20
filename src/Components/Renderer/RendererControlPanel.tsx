import React, { useState } from 'react';
import BackButton from '@comp/Common/BackButton';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@states/store';
import {
    SliderRow,
    ColorRow,
    ToggleRow,
    SelectRow,
} from './ControlRowComponents';
import {
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
    SKYBOX_OPTIONS,
    SHADOW_TYPES,
    SHADOW_MAP_SIZES,
    WATER_REFLECTION_SIZES,
} from '@states/slices/rendererSlice';

const controlPanelSettings = [
    'Lighting',
    'Shadow',
    'Water',
    'Post-processing',
    'Environment',
];

// ==== settings panels ====

const LightingSettings: React.FC = () => {
    const dispatch = useDispatch();
    const r = useSelector((state: RootState) => state.renderer);

    return (
        <div className="flex flex-col gap-2 w-full">
            <SliderRow
                label="Ambient Light"
                value={r.ambientLightIntensity}
                min={0}
                max={2}
                step={0.01}
                onChange={(v) => dispatch(updateAmbientLightIntensity(v))}
            />
            <SliderRow
                label="Sun Intensity"
                value={r.directionalLightIntensity}
                min={0}
                max={2}
                step={0.01}
                onChange={(v) => dispatch(updateDirectionalLightIntensity(v))}
            />
            <ColorRow
                label="Sun Color"
                value={r.sunColor}
                onChange={(v) => dispatch(updateSunColor(v))}
            />
            <SliderRow
                label="Sun Azimuth"
                value={r.sunAzimuth}
                min={0}
                max={360}
                step={1}
                onChange={(v) => dispatch(updateSunAzimuth(v))}
                displayValue={`${r.sunAzimuth}°`}
            />
            <SliderRow
                label="Sun Elevation"
                value={r.sunElevation}
                min={0}
                max={90}
                step={1}
                onChange={(v) => dispatch(updateSunElevation(v))}
                displayValue={`${r.sunElevation}°`}
            />
        </div>
    );
};

const ShadowSettings: React.FC = () => {
    const dispatch = useDispatch();
    const r = useSelector((state: RootState) => state.renderer);

    return (
        <div className="flex flex-col gap-2 w-full">
            <SelectRow
                label="Shadow Type"
                value={r.shadowType}
                options={SHADOW_TYPES.map((s) => ({
                    label: s.label,
                    value: s.value,
                }))}
                onChange={(v) =>
                    dispatch(updateShadowType(v as 'basic' | 'soft'))
                }
            />
            <SelectRow
                label="Shadow Quality"
                value={r.shadowMapSize}
                options={SHADOW_MAP_SIZES.map((s) => ({
                    label: `${s}×${s}${s === 2048 ? ' (default)' : ''}`,
                    value: s,
                }))}
                onChange={(v) => dispatch(updateShadowMapSize(Number(v)))}
            />
        </div>
    );
};

const WaterSettings: React.FC = () => {
    const dispatch = useDispatch();
    const r = useSelector((state: RootState) => state.renderer);

    return (
        <div className="flex flex-col gap-2 w-full">
            <ColorRow
                label="Water Color"
                value={r.waterColor}
                onChange={(v) => dispatch(updateWaterColor(v))}
            />
            <SelectRow
                label="Reflection Quality"
                value={r.waterReflectionSize}
                options={WATER_REFLECTION_SIZES.map((s) => ({
                    label: `${s}×${s}${s === 512 ? ' (default)' : ''}`,
                    value: s,
                }))}
                onChange={(v) => dispatch(updateWaterReflectionSize(Number(v)))}
            />
            <ToggleRow
                label="Water Fog"
                checked={r.waterFogEnabled}
                onChange={(v) => dispatch(updateWaterFogEnabled(v))}
            />
        </div>
    );
};

const PostProcessingSettings: React.FC = () => {
    const dispatch = useDispatch();
    const r = useSelector((state: RootState) => state.renderer);

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Vignette */}
            <ToggleRow
                label="Vignette"
                checked={r.vignetteEnabled}
                onChange={(v) => dispatch(updateVignetteEnabled(v))}
            />
            {r.vignetteEnabled && (
                <>
                    <SliderRow
                        label="  Offset"
                        value={r.vignetteOffset}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(v) => dispatch(updateVignetteOffset(v))}
                    />
                    <SliderRow
                        label="  Darkness"
                        value={r.vignetteDarkness}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(v) => dispatch(updateVignetteDarkness(v))}
                    />
                </>
            )}

            {/* Depth of Field */}
            <ToggleRow
                label="Depth of Field"
                checked={r.depthOfFieldEnabled}
                onChange={(v) => dispatch(updateDepthOfFieldEnabled(v))}
            />
            {r.depthOfFieldEnabled && (
                <>
                    <SliderRow
                        label="  Focal Length"
                        value={r.dofFocalLength}
                        min={1}
                        max={150}
                        step={1}
                        onChange={(v) => dispatch(updateDofFocalLength(v))}
                    />
                    <SliderRow
                        label="  Bokeh Scale"
                        value={r.dofBokehScale}
                        min={0}
                        max={10}
                        step={0.1}
                        onChange={(v) => dispatch(updateDofBokehScale(v))}
                    />
                </>
            )}

            {/* Chromatic Aberration */}
            <ToggleRow
                label="Chromatic Aberration"
                checked={r.chromaticAberrationEnabled}
                onChange={(v) => dispatch(updateChromaticAberrationEnabled(v))}
            />
            {r.chromaticAberrationEnabled && (
                <>
                    <SliderRow
                        label="  Offset X"
                        value={r.chromaticAberrationOffsetX}
                        min={0}
                        max={0.02}
                        step={0.001}
                        onChange={(v) =>
                            dispatch(updateChromaticAberrationOffsetX(v))
                        }
                    />
                    <SliderRow
                        label="  Offset Y"
                        value={r.chromaticAberrationOffsetY}
                        min={0}
                        max={0.02}
                        step={0.001}
                        onChange={(v) =>
                            dispatch(updateChromaticAberrationOffsetY(v))
                        }
                    />
                </>
            )}
        </div>
    );
};

const EnvironmentSettings: React.FC = () => {
    const dispatch = useDispatch();
    const r = useSelector((state: RootState) => state.renderer);

    return (
        <div className="flex flex-col gap-2 w-full">
            <SelectRow
                label="Skybox"
                value={r.skybox}
                options={SKYBOX_OPTIONS.map((s) => ({
                    label: s.label,
                    value: s.file,
                }))}
                onChange={(v) => dispatch(updateSkybox(v))}
            />
            <ToggleRow
                label="Fog"
                checked={r.fogEnabled}
                onChange={(v) => dispatch(updateFogEnabled(v))}
            />
            <ToggleRow
                label="Auto Rotate"
                checked={r.autoRotate}
                onChange={(v) => dispatch(updateAutoRotate(v))}
            />
            {r.autoRotate && (
                <SliderRow
                    label="  Rotate Speed"
                    value={r.autoRotateSpeed}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onChange={(v) => dispatch(updateAutoRotateSpeed(v))}
                />
            )}
        </div>
    );
};

// ==== main control panel ====

function RendererControlPanel() {
    const [currentSetting, setCurrentSetting] = useState(0);

    const handlePrevious = () => {
        setCurrentSetting((prev) =>
            prev === 0 ? controlPanelSettings.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentSetting((prev) =>
            prev === controlPanelSettings.length - 1 ? 0 : prev + 1
        );
    };

    const updateCurrentSetting = (ind: number) => {
        setCurrentSetting(ind);
    };

    const settingPanels = [
        <LightingSettings key="lighting" />,
        <ShadowSettings key="shadow" />,
        <WaterSettings key="water" />,
        <PostProcessingSettings key="post" />,
        <EnvironmentSettings key="env" />,
    ];

    return (
        <>
            {/* Top gradient with back button */}
            <div className="bottom-0 left-0 right-0 h-1/8 max-h-20 text-center bg-linear-to-b from-game-bg-light to-transparent z-50">
                <BackButton />
            </div>
            <div className="absolute flex flex-col justify-start gap-2 bottom-0 left-0 right-0 h-1/4 max-h-80 text-center bg-linear-to-t from-game-bg-light to-transparent z-50">
                {/* Header and left/right arrow */}
                <div className="flex items-center justify-between gap-4 max-w-3xl w-7/11 mx-auto">
                    <button
                        onClick={handlePrevious}
                        className="cursor-pointer text-game-primary hover:text-light-ink hover:scale-110 transition-all"
                        style={{
                            filter: 'drop-shadow(1px 3px 2px rgba(48,48,48,0.6))',
                        }}
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <h3 className="text-xl lg:text-2xl font-bold whitespace-nowrap">
                        {controlPanelSettings[currentSetting]}
                    </h3>
                    <button
                        onClick={handleNext}
                        className="cursor-pointer text-game-primary hover:text-light-ink hover:scale-110 transition-all"
                        style={{
                            filter: 'drop-shadow(1px 3px 2px rgba(48,48,48,0.6))',
                        }}
                    >
                        <ChevronRight size={36} />
                    </button>
                </div>

                {/*Dot indicator for the current setting panel*/}
                <div className="flex justify-center items-center gap-3 mb-4">
                    {controlPanelSettings.map((_, index) => {
                        return (
                            <button
                                key={controlPanelSettings[index]}
                                onClick={() => updateCurrentSetting(index)}
                                className={`rounded-full h-2 cursor-pointer transition-all duration-300 w-${index === currentSetting ? 6 + ' bg-game-primary' : 2 + ' bg-game-text-muted hover:bg-game-primary'} `}
                            ></button>
                        );
                    })}
                </div>

                {/*Dynamically displayed setting panel*/}
                <div className="max-w-3xl w-7/11 mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 pr-2 pb-4 mb-4">
                    {settingPanels[currentSetting]}
                </div>
            </div>
        </>
    );
}

export default RendererControlPanel;
