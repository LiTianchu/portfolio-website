/* eslint-disable react/no-unknown-property */
import React from 'react';
import { useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// import { Loader } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useSpring, animated, config } from '@react-spring/web';
// import type { RootState } from '@states/store';
import {
    updateSceneLoaded,
    // updateEffectLoaded,
} from '@states/slices/rendererSlice';
// import { useHelper } from '@react-three/drei';
// import { DirectionalLightHelper } from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import {
    EffectComposer,
    Vignette,
    DepthOfField,
} from '@react-three/postprocessing';

// Preload the model
useGLTF.preload(
    import.meta.env.BASE_URL +
        '/models/japanese_town_street_compressed/scene.glb'
);

// const SceneLoadingScreen: React.FC = () => {
//     return (
//         <Html center>
//             <Loadei
//                  className="animate-spin [animation-duration:2s] text-game-primary"
//                 size={48}
//             />
//         </Html>
//     );
// };

// const modelModules = import.meta.glob('@assets/models/**/*', {
//     eager: true,
//     query: '?url',
//     import: 'default',
// });
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
            castShadow
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
    // const modelPath: string = `/src/assets/models/${subPath}`;
    const modelPath: string = import.meta.env.BASE_URL + `/models/${subPath}`;
    // console.log(`Attempting to load model from path: ${modelPath}`);
    // const actualModelPath: string | undefined = modelModules[modelPath] as
    //     | string
    //     | undefined;
    //
    // if (!actualModelPath) {
    //     console.error(`Model not found at path: ${modelPath}`);
    //     return null;
    // }

    // const { scene } = useGLTF(actualModelPath);
    const { scene } = useGLTF(modelPath);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;
                console.log(mesh.material);
            }
        });
    }, [scene]);

    return <primitive object={scene} position={[0, 0, 0]} scale={0.1} />;
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

const WaterPlane: React.FC = () => {
    const waterRef = useRef<Water>(null);
    const waterNormals = useLoader(
        THREE.TextureLoader,
        'https://threejs.org/examples/textures/waternormals.jpg'
    );

    const waterPlane = useMemo(() => {
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        waterNormals.needsUpdate = true;

        const water = new Water(new THREE.PlaneGeometry(1000, 1000, 8, 8), {
            textureWidth: 128,
            textureHeight: 128,
            waterNormals: waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 6,
            fog: true,
        });

        // Explicitly initialize time to 0 to prevent strips on first render
        water.material.uniforms['time'].value = 0.0;
        water.material.needsUpdate = true;

        return water;
    }, [waterNormals]);

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
            position={[0, -2, 0]}
        />
    );
};

const SceneReady: React.FC<{ onReady: () => void }> = ({ onReady }) => {
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);

    useEffect(() => {
        // Compile all materials before showing to prevent lag spike
        gl.compile(scene, camera);

        // Short delay to ensure everything is rendered
        const timer = setTimeout(() => {
            onReady();
        }, 100);

        return () => clearTimeout(timer);
    }, [gl, scene, camera, onReady]);

    return null;
};

const RendererMain: React.FC = () => {
    const dispatch = useDispatch();

    const [canvasSpringStyles, canvasSpringApi] = useSpring(() => ({
        opacity: 0,
        config: config.slow,
    }));
    // const isEffectLoaded = useSelector((state: RootState) => {
    //     return state.renderer.effectLoaded;
    // });

    // useEffect(() => {
    //     // Defer post-processing effects to reduce initial load
    //     if (isSceneLoaded) {
    //         const timer = setTimeout(() => {
    //             dispatch(updateEffectLoaded(true));
    //         }, 1500);
    //         return () => clearTimeout(timer);
    //     }
    // }, [isSceneLoaded, dispatch]);

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
                        near: 0.1,
                        far: 1000,
                    }}
                    shadows="soft"
                    dpr={[1, 2]}
                    gl={{
                        antialias:
                            typeof window !== 'undefined' &&
                            window.innerWidth > 768,
                        powerPreference: 'high-performance',
                        alpha: false,
                        stencil: false,
                        depth: true,
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#87ceeb');
                    }}
                >
                    <Suspense fallback={null}>
                        <fog attach="fog" args={['#87ceeb', 50, 500]} />
                        <Skybox />
                        <ambientLight intensity={0.5} />
                        <SceneDirectionalLight />
                        <Model subPath="japanese_town_street_compressed/scene.glb" />
                        <WaterPlane />
                        <SceneReady onReady={handleSceneReady} />
                        <OrbitControls
                            autoRotate
                            autoRotateSpeed={1}
                            enableZoom={true}
                            enablePan={true}
                            enableDamping
                            dampingFactor={0.05}
                            makeDefault
                        />
                        <EffectComposer multisampling={4}>
                            <Vignette offset={0.4} darkness={0.5} />
                            <DepthOfField
                                target={0}
                                focalLength={40}
                                bokehScale={1}
                            />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
            </animated.div>
        </div>
    );
};

export default RendererMain;
