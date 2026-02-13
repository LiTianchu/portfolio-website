import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// const modelModules = import.meta.glob('@assets/models/**/*', {
//     eager: true,
//     query: '?url',
//     import: 'default',
// });

const getModelBySubPath = (subPath: string) => {
    // const modelPath: string = `/src/assets/models/${subPath}`;
    const modelPath: string = import.meta.env.BASE_URL + `/models/${subPath}`;
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

    return <primitive object={scene} />;
};

const RendererMain: React.FC = () => {
    // const loadedScene = getModelBySubPath('forest_house/scene.gltf');
    const loadedScene = getModelBySubPath(
        'stylized_little_japanese_town_street/scene.gltf'
    );
    return (
        // TODO: implement a 3D viewer functonality
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{
                    position: [0, 800, 800],
                    rotation: [70, 0, 0],
                    fov: 75,
                    near: 1,
                    far: 2000,
                }}
            >
                <ambientLight intensity={1} />
                <directionalLight position={[1000, 1000, 500]} intensity={1} />
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
