import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const getModelBySubPath = (subPath: string) => {
    const modelPath: string = `/src/assets/models/${subPath}`;
    const actualModelPath: string | undefined = modelModules[modelPath] as
        | string
        | undefined;

    if (!actualModelPath) {
        console.error(`Model not found at path: ${modelPath}`);
    }

    const { scene } = useGLTF(actualModelPath);

    return <primitive object={scene} scale={3000} />;
};

const modelModules = import.meta.glob('@assets/models/**/*', {
    eager: true,
    query: '?url',
    import: 'default',
});

const RendererMain: React.FC = () => {
    const loadedScene = getModelBySubPath('forest_house/scene.gltf');
    // const loadedScene = getModelBySubPath('sea_keep_lonely_watcher/scene.gltf');
    return (
        // TODO: implement a 3D viewer functonality
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{
                    position: [0, 400, 400],
                    rotation: [45, 0, 0],
                    fov: 60,
                    near: 1,
                    far: 2000,
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[1000, 1000, 500]} intensity={5} />
                {loadedScene}
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={2}
                    enableZoom={true}
                    enablePan={true}
                />
            </Canvas>
        </div>
    );
};

export default RendererMain;
