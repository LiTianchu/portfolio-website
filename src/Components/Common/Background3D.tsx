import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
    count: number;
    timeOfDay: 'day' | 'night' | 'sunset';
}

const Particles: React.FC<ParticlesProps> = ({ count, timeOfDay }) => {
    const mesh = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorPalette = {
            day: [
                new THREE.Color('#a8d4f0'),
                new THREE.Color('#b8a8d4'),
                new THREE.Color('#e8f0ff'),
            ],
            night: [
                new THREE.Color('#88b8d8'),
                new THREE.Color('#a8c8e8'),
                new THREE.Color('#c8d8f0'),
            ],
            sunset: [
                new THREE.Color('#d4c8e8'),
                new THREE.Color('#c8b8d4'),
                new THREE.Color('#e8d8f0'),
            ],
        };

        const palette = colorPalette[timeOfDay];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        return { positions, colors, sizes };
    }, [count, timeOfDay]);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
            mesh.current.rotation.y = state.clock.elapsedTime * 0.03;

            const positions = mesh.current.geometry.attributes.position
                .array as Float32Array;
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                positions[i3 + 1] +=
                    Math.sin(state.clock.elapsedTime + i * 0.1) * 0.002;
            }
            mesh.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

interface FloatingGeometryProps {
    timeOfDay: 'day' | 'night' | 'sunset';
}

const FloatingGeometry: React.FC<FloatingGeometryProps> = ({ timeOfDay }) => {
    const groupRef = useRef<THREE.Group>(null);

    const colorMap = {
        day: '#a8d4f0',
        night: '#88b8d8',
        sunset: '#d4c8e8',
    };

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            groupRef.current.position.y =
                Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central icosahedron */}
            <mesh position={[0, 0, -10]}>
                <icosahedronGeometry args={[2, 1]} />
                <meshBasicMaterial
                    color={colorMap[timeOfDay]}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Orbiting torus */}
            <mesh position={[5, 2, -15]} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1.5, 0.3, 16, 100]} />
                <meshBasicMaterial
                    color="#b8a8d4"
                    wireframe
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {/* Another floating shape */}
            <mesh position={[-6, -2, -12]}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial
                    color="#a8d8e8"
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>
        </group>
    );
};

interface GridFloorProps {
    timeOfDay: 'day' | 'night' | 'sunset';
}

const GridFloor: React.FC<GridFloorProps> = ({ timeOfDay }) => {
    const gridRef = useRef<THREE.GridHelper>(null);

    const colorMap = {
        day: '#a8d4f0',
        night: '#88b8d8',
        sunset: '#d4c8e8',
    };

    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z =
                ((state.clock.elapsedTime * 2) % 2) - 1;
        }
    });

    return (
        <gridHelper
            ref={gridRef}
            args={[100, 50, colorMap[timeOfDay], colorMap[timeOfDay]]}
            position={[0, -5, 0]}
            rotation={[0, 0, 0]}
        />
    );
};

interface Background3DProps {
    timeOfDay?: 'day' | 'night' | 'sunset';
    weather?: 'clear' | 'rain' | 'snow';
}

const Background3D: React.FC<Background3DProps> = ({ timeOfDay = 'night' }) => {
    const bgColorMap = {
        day: '#0a1520',
        night: '#0a0f18',
        sunset: '#0f1018',
    };

    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ background: bgColorMap[timeOfDay] }}
            >
                <ambientLight intensity={0.5} />
                <Particles count={500} timeOfDay={timeOfDay} />
                <FloatingGeometry timeOfDay={timeOfDay} />
                <GridFloor timeOfDay={timeOfDay} />
            </Canvas>
            {/* Ethereal frost overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(168, 212, 240, 0.05) 3px, rgba(168, 212, 240, 0.05) 6px)',
                }}
            />
        </div>
    );
};

export default Background3D;
