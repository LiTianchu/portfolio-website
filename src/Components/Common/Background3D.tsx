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
                new THREE.Color('#00d4ff'),
                new THREE.Color('#7b2cbf'),
                new THREE.Color('#ffffff'),
            ],
            night: [
                new THREE.Color('#00d4ff'),
                new THREE.Color('#7b2cbf'),
                new THREE.Color('#00ff88'),
            ],
            sunset: [
                new THREE.Color('#ff6b35'),
                new THREE.Color('#ffb800'),
                new THREE.Color('#ff3366'),
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
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
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
        day: '#00d4ff',
        night: '#7b2cbf',
        sunset: '#ff6b35',
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
                    color="#7b2cbf"
                    wireframe
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {/* Another floating shape */}
            <mesh position={[-6, -2, -12]}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial
                    color="#00ff88"
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
        day: '#00d4ff',
        night: '#7b2cbf',
        sunset: '#ff6b35',
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
        day: '#0a1628',
        night: '#0a0a0f',
        sunset: '#1a0a1e',
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
            {/* Scan line effect overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.03) 2px, rgba(0, 212, 255, 0.03) 4px)',
                }}
            />
        </div>
    );
};

export default Background3D;
