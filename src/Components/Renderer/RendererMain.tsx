/* eslint-disable react/no-unknown-property */
import React from 'react';
import { useEffect, useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useDispatch } from 'react-redux';
import { useSpring, animated, config } from '@react-spring/web';
import { updateSceneLoaded } from '@states/slices/rendererSlice';
// import { useHelper } from '@react-three/drei';
// import { DirectionalLightHelper } from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import {
    EffectComposer,
    Vignette,
    DepthOfField,
} from '@react-three/postprocessing';

// Preload the model
// useGLTF.preload(
//     import.meta.env.BASE_URL + '/models/japanese_town_street/scene.glb'
// );
useGLTF.preload(import.meta.env.BASE_URL + '/models/forest_house/scene.glb');

const SceneDirectionalLight: React.FC = () => {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    // useHelper(
    //     lightRef as React.RefObject<THREE.DirectionalLight>,
    //     DirectionalLightHelper,
    //     5,
    //     'cyan'
    // );
    return (
        <directionalLight
            ref={lightRef}
            position={[30, 50, 30]}
            intensity={0.7}
            castShadow={true}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={500}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
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

    return <primitive object={scene} position={[0, 0, 0]} scale={1} />;
};

const Skybox: React.FC = () => {
    const { scene } = useThree();
    const texture = useLoader(
        THREE.TextureLoader,
        import.meta.env.BASE_URL + '/skyboxes/PurplyBlueSky.png'
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

const WaterPlane: React.FC<{ lowPerformance?: boolean }> = ({
    lowPerformance = false,
}) => {
    const waterRef = useRef<Water>(null);
    const waterNormals = useLoader(
        THREE.TextureLoader,
        'https://threejs.org/examples/textures/waternormals.jpg'
    );

    const waterPlane = useMemo(() => {
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        waterNormals.needsUpdate = true;

        const water = new Water(
            new THREE.PlaneGeometry(
                1000,
                1000,
                lowPerformance ? 8 : 16,
                lowPerformance ? 8 : 16
            ),
            {
                textureWidth: lowPerformance ? 128 : 256,
                textureHeight: lowPerformance ? 128 : 256,
                waterNormals: waterNormals,
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3,
                fog: !lowPerformance,
            }
        );

        water.material.uniforms['time'].value = 0.0;
        water.material.needsUpdate = true;

        return water;
    }, [waterNormals, lowPerformance]);

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
            position={[0, 4.754, 0]}
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
    onPerformanceChange: (isLowPerf: boolean) => void;
}> = ({ onPerformanceChange }) => {
    const lastTimeRef = useRef<number>(performance.now());
    const frameTimesRef = useRef<number[]>([]);
    const lowPerfCountRef = useRef<number>(0);
    const hasReportedRef = useRef<boolean>(false);

    useFrame(() => {
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
            const FPS_THRESHOLD_1 = 50;
            const FPS_THRESHOLD_2 = 35;
            console.log(`Current FPS: ${fps.toFixed(1)}`);
            if (fps < FPS_THRESHOLD_1) {
                lowPerfCountRef.current++;
            } else if (fps < FPS_THRESHOLD_2) {
                lowPerfCountRef.current += 2; // count more heavily if below critical threshold
            } else {
                lowPerfCountRef.current = 0;
            }

            // report low performance if consistently low for 5 consecutive checks
            if (lowPerfCountRef.current >= 5 && !hasReportedRef.current) {
                console.log(
                    `Low FPS detected: ${fps.toFixed(1)} FPS - Disabling heavy effects`
                );
                onPerformanceChange(true);
                hasReportedRef.current = true;
            }

            // clear frame times for next batch
            frameTimesRef.current = [];
        }
    });

    return null;
};

const RendererMain: React.FC = () => {
    const dispatch = useDispatch();
    const [isLowPerformance, setIsLowPerformance] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);

    const [canvasSpringStyles, canvasSpringApi] = useSpring(() => ({
        opacity: 0,
        config: config.slow,
    }));

    // Show notification when low performance is detected
    useEffect(() => {
        if (isLowPerformance && !showNotification) {
            setShowNotification(true);

            // Trigger fade-in after mount
            const mountTimer = setTimeout(() => {
                setIsNotificationVisible(true);
            }, 10);

            // Start fade out after 4 seconds
            const fadeTimer = setTimeout(() => {
                setIsNotificationVisible(false);
            }, 4000);

            // Completely remove after fade-out transition completes
            const hideTimer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);

            return () => {
                clearTimeout(mountTimer);
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isLowPerformance]);

    const handleSceneReady = () => {
        dispatch(updateSceneLoaded(true));
        canvasSpringApi.start({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: config.gentle,
        });
    };

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
                    shadows={isLowPerformance ? 'basic' : 'soft'}
                    dpr={isLowPerformance ? [1, 1] : [1, 2]}
                    gl={{
                        antialias:
                            !isLowPerformance &&
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
                        {!isLowPerformance && (
                            <fog attach="fog" args={['#87ceeb', 50, 500]} />
                        )}
                        <Skybox />
                        <ambientLight intensity={0.5} />
                        <SceneDirectionalLight />
                        {/* <Model subPath="japanese_town_street/scene.glb" /> */}
                        <Model subPath="forest_house/scene.glb" />
                        <WaterPlane lowPerformance={isLowPerformance} />
                        <SceneReady onReady={handleSceneReady} />
                        <PerformanceMonitor
                            onPerformanceChange={setIsLowPerformance}
                        />
                        <OrbitControls
                            autoRotate
                            autoRotateSpeed={1}
                            enableZoom={true}
                            enablePan={true}
                            enableDamping
                            dampingFactor={0.05}
                            makeDefault
                        />
                        {isLowPerformance ? (
                            <EffectComposer multisampling={0}>
                                <Vignette offset={0.4} darkness={0.5} />
                            </EffectComposer>
                        ) : (
                            <EffectComposer multisampling={4}>
                                <Vignette offset={0.4} darkness={0.5} />
                                <DepthOfField
                                    target={0}
                                    focalLength={40}
                                    bokehScale={1}
                                />
                            </EffectComposer>
                        )}
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
                            Low FPS - Disabling heavy effects
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RendererMain;
