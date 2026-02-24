/* eslint-disable react/no-unknown-property */
import React from 'react';
import { useEffect, useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@states/store';
import { useSpring, animated, config } from '@react-spring/web';
import {
    updateSceneLoaded,
    updateDepthOfFieldEnabled,
    updateChromaticAberrationEnabled,
    updateVignetteEnabled,
    updateWaterReflectionSize,
} from '@states/slices/rendererSlice';
// import { useHelper } from '@react-three/drei';
// import { DirectionalLightHelper } from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import {
    EffectComposer,
    Vignette,
    DepthOfField,
    ChromaticAberration,
} from '@react-three/postprocessing';
import { Vector2 } from 'three';

// preload the model
useGLTF.preload(
    import.meta.env.BASE_URL + '/models/japanese_town_street/scene.glb'
);
// useGLTF.preload(import.meta.env.BASE_URL + '/models/forest_house/scene.glb');

const SceneDirectionalLight: React.FC = () => {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    const directionalLightIntensity = useSelector(
        (state: RootState) => state.renderer.directionalLightIntensity
    );
    const sunColor = useSelector((state: RootState) => state.renderer.sunColor);
    const sunAzimuth = useSelector(
        (state: RootState) => state.renderer.sunAzimuth
    );
    const sunElevation = useSelector(
        (state: RootState) => state.renderer.sunElevation
    );
    const shadowMapSize = useSelector(
        (state: RootState) => state.renderer.shadowMapSize
    );

    const sunPosition = useMemo(() => {
        const r = 100;
        const azRad = (sunAzimuth * Math.PI) / 180;
        const elRad = (sunElevation * Math.PI) / 180;

        // spherical to cartesian conversion
        return [
            r * Math.cos(elRad) * Math.cos(azRad), // when elevation = 0, no horizontal component (e.g. cos(90) = 0)
            r * Math.sin(elRad), // height scale with elevation (e.g. sin(90) = 1)
            r * Math.cos(elRad) * Math.sin(azRad), // when elevation = 0, no horizontal component (e.g. cos(90) = 0)
        ] as [number, number, number];
    }, [sunAzimuth, sunElevation]);

    // update shadow map size imperatively so changes apply in real-time (controlled component does not apply the changes in real-time)
    useEffect(() => {
        const light = lightRef.current;
        if (!light) return;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;
        // dispose old map so Three.js recreates it at the new size
        if (light.shadow.map) {
            light.shadow.map.dispose();
            light.shadow.map = null as unknown as THREE.WebGLRenderTarget;
        }
        light.shadow.needsUpdate = true;
    }, [shadowMapSize]);

    // directional light visualization helper
    // useHelper(
    //     lightRef as React.RefObject<THREE.DirectionalLight>,
    //     DirectionalLightHelper,
    //     5,
    //     'cyan'
    // );

    return (
        <directionalLight
            ref={lightRef}
            position={sunPosition}
            intensity={directionalLightIntensity}
            color={sunColor}
            castShadow={true}
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
            shadow-camera-near={1}
            shadow-camera-far={1000}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
        />
    );
};

const Model: React.FC<{ subPath: string }> = ({ subPath }) => {
    const modelPath: string = import.meta.env.BASE_URL + `/models/${subPath}`;

    const { scene } = useGLTF(modelPath);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;

                const materials = Array.isArray(mesh.material)
                    ? mesh.material
                    : [mesh.material];

                // handle transparency for materials
                materials.forEach((mat) => {
                    if (
                        mat instanceof THREE.MeshStandardMaterial ||
                        mat instanceof THREE.MeshBasicMaterial ||
                        mat instanceof THREE.MeshPhysicalMaterial ||
                        mat instanceof THREE.MeshLambertMaterial ||
                        mat instanceof THREE.MeshPhongMaterial
                    ) {
                        if (mat.transparent || mat.opacity < 1) {
                            // check if this is a cutout material (binary alpha like foliage/fences)
                            // by inspecting whether the alpha map or base texture has hard edges
                            if (
                                mat.alphaMap ||
                                (mat.map && mat.alphaTest === 0)
                            ) {
                                // use alpha test for cutout-style transparency
                                // keeps depthWrite on so sorting is correct,
                                // discards pixels below the threshold
                                mat.alphaTest = 0.5;
                                mat.transparent = false;
                                mat.depthWrite = true;
                            } else {
                                // true semi-transparency (glass, etc.)
                                // disable depth writes so geometry behind is not occluded
                                mat.depthWrite = false;
                                mat.transparent = true;
                            }
                            // render transparent objects after opaque ones to ensure correct blending
                            mesh.renderOrder = 1;
                            mat.needsUpdate = true;
                        }
                    }
                });
            }
        });
    }, [scene]);

    return <primitive object={scene} position={[0, 0, 0]} scale={0.1} />;
};

const Skybox: React.FC = () => {
    const { scene } = useThree();
    const skybox = useSelector((state: RootState) => state.renderer.skybox);
    const texture = useLoader(
        THREE.TextureLoader,
        import.meta.env.BASE_URL + `/skyboxes/${skybox}`
    );

    useEffect(() => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;

        return () => {
            scene.background = null;
        };
    }, [scene, texture]);

    return null;
};

const WaterPlane: React.FC = () => {
    const waterRef = useRef<Water>(null);
    const waterColor = useSelector(
        (state: RootState) => state.renderer.waterColor
    );
    const waterReflectionSize = useSelector(
        (state: RootState) => state.renderer.waterReflectionSize
    );
    const waterFogEnabled = useSelector(
        (state: RootState) => state.renderer.waterFogEnabled
    );
    const sunColor = useSelector((state: RootState) => state.renderer.sunColor);
    const waterNormals = useLoader(
        THREE.TextureLoader,
        'https://threejs.org/examples/textures/waternormals.jpg'
    );

    const isLowRes = waterReflectionSize <= 64;

    const waterPlane = useMemo(() => {
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        waterNormals.needsUpdate = true;

        const water = new Water(
            new THREE.PlaneGeometry(
                1000,
                1000,
                isLowRes ? 8 : 16,
                isLowRes ? 8 : 16
            ),
            {
                textureWidth: waterReflectionSize,
                textureHeight: waterReflectionSize,
                waterNormals: waterNormals,
                sunDirection: new THREE.Vector3(),
                sunColor: new THREE.Color(sunColor).getHex(),
                waterColor: new THREE.Color(waterColor).getHex(),
                distortionScale: 3,
                fog: waterFogEnabled,
            }
        );

        water.material.uniforms['time'].value = 0.0;
        water.material.needsUpdate = true;

        return water;
    }, [
        waterNormals,
        isLowRes,
        waterReflectionSize,
        waterColor,
        sunColor,
        waterFogEnabled,
    ]);

    useFrame((_, delta) => {
        if (waterRef.current && waterRef.current.material.uniforms['time']) {
            waterRef.current.material.uniforms['time'].value += delta * 0.5;
        }
    });

    return (
        <primitive
            ref={waterRef}
            object={waterPlane}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.05, 0]}
        />
    );
};

const SceneReady: React.FC<{ onReady: () => void }> = ({ onReady }) => {
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);

    useEffect(() => {
        gl.compile(scene, camera);

        const timer = setTimeout(() => {
            onReady();
        }, 100);

        return () => clearTimeout(timer);
    }, [gl, scene, camera, onReady]);

    return null;
};

const PerformanceMonitor: React.FC<{
    onPerformanceChange: () => void;
    degradationLevel: number;
    maxDegradationLevel: number;
}> = ({ onPerformanceChange, degradationLevel, maxDegradationLevel }) => {
    const lastTimeRef = useRef<number>(performance.now());
    const frameTimesRef = useRef<number[]>([]);
    const lowPerfCountRef = useRef<number>(0);
    const prevDegradationLevelRef = useRef<number>(degradationLevel);

    useFrame(() => {
        // Stop monitoring if max degradation level reached
        if (degradationLevel >= maxDegradationLevel) return;

        // Reset counters when degradation level changes (new baseline after downgrade)
        if (degradationLevel !== prevDegradationLevelRef.current) {
            prevDegradationLevelRef.current = degradationLevel;
            lowPerfCountRef.current = 0;
            frameTimesRef.current = [];
            lastTimeRef.current = performance.now();
            return;
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // track frame times
        frameTimesRef.current.push(deltaTime);

        // keep only last 30 frames for average calculation
        if (frameTimesRef.current.length > 30) {
            frameTimesRef.current.shift();
        }

        // calculate average FPS every 30 frames
        if (frameTimesRef.current.length >= 30) {
            const avgFrameTime =
                frameTimesRef.current.reduce((a, b) => a + b, 0) /
                frameTimesRef.current.length;
            const fps = 1000 / avgFrameTime;

            // disable heavy effects below 30 FPS
            const FPS_THRESHOLD_1 = 55;
            const FPS_THRESHOLD_2 = 49;
            const FPS_THRESHOLD_3 = 30;
            console.log(`Current FPS: ${fps.toFixed(1)}`);
            if (fps < FPS_THRESHOLD_1 && fps >= FPS_THRESHOLD_2) {
                lowPerfCountRef.current++;
                console.log(
                    `Moderate FPS detected: ${fps.toFixed(1)} FPS, incrementing low performance count to ${lowPerfCountRef.current}`
                );
            } else if (fps < FPS_THRESHOLD_2 && fps >= FPS_THRESHOLD_3) {
                lowPerfCountRef.current += 3; // count more heavily if below low threshold
                console.log(
                    `Low FPS detected: ${fps.toFixed(1)} FPS, incrementing low performance count to ${lowPerfCountRef.current}`
                );
            } else if (fps < FPS_THRESHOLD_3) {
                lowPerfCountRef.current += 5; // count even more heavily if below critical threshold
                console.log(
                    `Critical FPS detected: ${fps.toFixed(1)} FPS, incrementing low performance count to ${lowPerfCountRef.current}`
                );
            } else {
                lowPerfCountRef.current = 0;
            }

            // report low performance if consistently low for some consecutive checks
            if (lowPerfCountRef.current >= 10) {
                console.log(
                    `Low FPS detected: ${fps.toFixed(1)} FPS - Applying degradation level ${degradationLevel + 1}`
                );
                onPerformanceChange();
                lowPerfCountRef.current = 0;
            }

            // clear frame times for next batch
            frameTimesRef.current = [];
        }
    });

    return null;
};

const PostProcessingEffects: React.FC = () => {
    const vignetteEnabled = useSelector(
        (state: RootState) => state.renderer.vignetteEnabled
    );
    const vignetteOffset = useSelector(
        (state: RootState) => state.renderer.vignetteOffset
    );
    const vignetteDarkness = useSelector(
        (state: RootState) => state.renderer.vignetteDarkness
    );
    const depthOfFieldEnabled = useSelector(
        (state: RootState) => state.renderer.depthOfFieldEnabled
    );
    const dofFocalLength = useSelector(
        (state: RootState) => state.renderer.dofFocalLength
    );
    const dofBokehScale = useSelector(
        (state: RootState) => state.renderer.dofBokehScale
    );
    const chromaticAberrationEnabled = useSelector(
        (state: RootState) => state.renderer.chromaticAberrationEnabled
    );
    const chromaticAberrationOffsetX = useSelector(
        (state: RootState) => state.renderer.chromaticAberrationOffsetX
    );
    const chromaticAberrationOffsetY = useSelector(
        (state: RootState) => state.renderer.chromaticAberrationOffsetY
    );

    const caOffset = useMemo(
        () =>
            new Vector2(chromaticAberrationOffsetX, chromaticAberrationOffsetY),
        [chromaticAberrationOffsetX, chromaticAberrationOffsetY]
    );

    const hasAnyEffect =
        vignetteEnabled || depthOfFieldEnabled || chromaticAberrationEnabled;

    // Build effect list dynamically to satisfy EffectComposer's children types
    const effects: React.ReactElement[] = [];

    if (vignetteEnabled) {
        effects.push(
            <Vignette
                key="vig"
                offset={vignetteOffset}
                darkness={vignetteDarkness}
            />
        );
    }

    if (depthOfFieldEnabled) {
        effects.push(
            <DepthOfField
                key="dof"
                target={0}
                focalLength={dofFocalLength}
                bokehScale={dofBokehScale}
            />
        );
    }

    if (chromaticAberrationEnabled) {
        effects.push(<ChromaticAberration key="ca" offset={caOffset} />);
    }

    if (!hasAnyEffect) return null;

    return <EffectComposer multisampling={4}>{effects}</EffectComposer>;
};

const RendererMain: React.FC = () => {
    const dispatch = useDispatch();
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [isNotificationVisible, setIsNotificationVisible] =
        useState<boolean>(false);
    const [degradationLevel, setDegradationLevel] = useState<number>(0);
    const [notificationMessage, setNotificationMessage] = useState<string>('');

    const ambientLightIntensity = useSelector(
        (state: RootState) => state.renderer.ambientLightIntensity
    );
    const autoRotate = useSelector(
        (state: RootState) => state.renderer.autoRotate
    );
    const autoRotateSpeed = useSelector(
        (state: RootState) => state.renderer.autoRotateSpeed
    );
    const shadowType = useSelector(
        (state: RootState) => state.renderer.shadowType
    );
    const fogEnabled = useSelector(
        (state: RootState) => state.renderer.fogEnabled
    );

    const [canvasSpringStyles, canvasSpringApi] = useSpring(() => ({
        opacity: 0,
        config: config.slow,
    }));

    // when PerformanceMonitor detects low FPS, downgrade settings in tiers
    // Tier 1: disable post-processing + lower water reflection (biggest perf impact)
    // Tier 2: further reduce water reflection quality
    const handleLowPerformance = () => {
        setDegradationLevel((prev) => {
            if (prev === 0) {
                // Tier 1: Disable post-processing + reduce water reflection
                dispatch(updateDepthOfFieldEnabled(false));
                dispatch(updateChromaticAberrationEnabled(false));
                dispatch(updateVignetteEnabled(false));
                dispatch(updateWaterReflectionSize(256));
                setNotificationMessage(
                    'Low FPS – Disabled post-processing effects'
                );
            } else if (prev === 1) {
                // Tier 2: Further reduce water reflection quality
                dispatch(updateWaterReflectionSize(64));
                setNotificationMessage('Still low FPS – Reduced water quality');
            }
            return prev + 1;
        });

        // show notification when downgrade settings
        setShowNotification(true);
        const mountTimer = setTimeout(() => {
            setIsNotificationVisible(true);
        }, 10);
        const fadeTimer = setTimeout(() => {
            setIsNotificationVisible(false);
        }, 4000);
        const hideTimer = setTimeout(() => {
            setShowNotification(false);
        }, 5000);

        return () => {
            clearTimeout(mountTimer);
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    };

    const handleSceneReady = () => {
        dispatch(updateSceneLoaded(true));
        canvasSpringApi.start({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: config.gentle,
        });
    };

    const isMobile = useSelector((state: RootState) => state.app.isMobile);

    return (
        <div className="fixed inset-0 z-0">
            <animated.div
                style={canvasSpringStyles}
                className="fixed inset-0 transition-opacity duration-500"
            >
                <Canvas
                    camera={{
                        position: [0, 100, 100],
                        fov: 60,
                        near: 1,
                        far: 1000,
                    }}
                    shadows={shadowType}
                    dpr={[1, 2]}
                    gl={{
                        antialias:
                            typeof window !== 'undefined' &&
                            window.innerWidth > 768,
                        powerPreference: 'high-performance',
                        alpha: false,
                        stencil: false,
                        depth: true,
                        logarithmicDepthBuffer: true,
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#87ceeb');
                    }}
                >
                    <Suspense fallback={null}>
                        {fogEnabled && (
                            <fog attach="fog" args={['#87ceeb', 50, 500]} />
                        )}
                        <Skybox />
                        <ambientLight intensity={ambientLightIntensity} />
                        <SceneDirectionalLight />
                        <Model subPath="japanese_town_street/scene.glb" />
                        {/* <Model subPath="forest_house/scene.glb" /> */}
                        <WaterPlane />
                        <SceneReady onReady={handleSceneReady} />
                        <PerformanceMonitor
                            onPerformanceChange={handleLowPerformance}
                            degradationLevel={isMobile ? 2 : degradationLevel}
                            maxDegradationLevel={2}
                        />
                        <OrbitControls
                            autoRotate={autoRotate}
                            autoRotateSpeed={autoRotateSpeed}
                            enableZoom={true}
                            enablePan={true}
                            enableDamping
                            dampingFactor={0.05}
                            makeDefault
                        />
                        <PostProcessingEffects />
                    </Suspense>
                </Canvas>
            </animated.div>
            {showNotification && (
                <div
                    className={`fixed top-3 md:top-4 xl:top-8 left-1/2 w-3/4 max-w-80 -translate-x-1/2 z-50 px-6 py-3 bg-glass-bg/50 backdrop-blur-sm text-game-primary rounded-lg shadow-xl border border-gray-700 transition-all duration-700 ease-out ${
                        isNotificationVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 -translate-y-5'
                    }`}
                >
                    <div className="flex items-center gap-3 text-center justify-center">
                        <span className="text-xs md:text-sm font-medium">
                            {notificationMessage}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RendererMain;
