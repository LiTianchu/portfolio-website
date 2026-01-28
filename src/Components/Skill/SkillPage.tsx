import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import Tree from 'react-d3-tree';
import type { RawNodeDatum } from 'react-d3-tree';
import skillsJSON from '@assets/skills.json';
import BackButton from '@comp/Common/BackButton';
import CustomNode from './CustomNode';
import SkillDetail from './SkillDetail';

export type SkillAttributes = Record<string, string | number | boolean>;

export interface SkillNode extends RawNodeDatum {
    name: string;
    attributes?: SkillAttributes;
    children?: SkillNode[];
}

export const levelColors: Record<string, string> = {
    Root: '#f7fcfc',
    Category: '#f0ecaf',
    Advanced: '#c4a8d8',
    Intermediate: '#88d4d8',
    Beginner: '#a8d8b8',
};

const SkillPage: React.FC = () => {
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
    const [treeData] = useState<RawNodeDatum>(
        (skillsJSON as { skillTree: RawNodeDatum }).skillTree
    );
    const [translate, setTranslate] = useState({ x: 0, y: 60 });
    const [zoom, setZoom] = useState(0.7);
    const treeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTranslateAndZoom = () => {
            if (treeContainerRef.current) {
                const { width } =
                    treeContainerRef.current.getBoundingClientRect();
                setTranslate({ x: width / 2, y: 60 });

                // Calculate zoom based on screen width
                // Larger screens get more zoom (higher value)
                // Mobile: ~0.5, Tablet: ~0.65, Desktop: ~0.8-1.0
                const screenWidth = window.innerWidth;
                let calculatedZoom = 0.5;

                if (screenWidth < 640) {
                    // Mobile
                    calculatedZoom = 0.45;
                } else if (screenWidth < 1024) {
                    // Tablet
                    calculatedZoom = 0.6;
                } else if (screenWidth < 1440) {
                    // Small desktop
                    calculatedZoom = 0.75;
                } else if (screenWidth < 1920) {
                    // Desktop
                    calculatedZoom = 0.85;
                } else {
                    // Large desktop
                    calculatedZoom = 1.0;
                }

                setZoom(calculatedZoom);
            }
        };

        updateTranslateAndZoom();
        window.addEventListener('resize', updateTranslateAndZoom);
        return () =>
            window.removeEventListener('resize', updateTranslateAndZoom);
    }, []);

    const headerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const treeSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 300,
        config: config.gentle,
    });

    const handleNodeClick = useCallback((node: SkillNode) => {
        setSelectedSkill(node);
    }, []);

    return (
        <div className="page-container">
            <div className="content-container-wide glass-panel-dark p-8 h-[85vh] flex flex-col w-[75vw] md:w-[90vw] sm:w-[95vw]">
                <div className="mb-4 flex justify-start">
                    <BackButton />
                </div>
                {/* Header */}
                <animated.div style={headerSpring} className="text-center mb-4">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-game-primary glow-text">
                            SKILL
                        </span>
                        <span className="text-game-text-primary"> TREE</span>
                    </h1>
                    <p className="text-game-text-secondary tracking-wider">
                        CLICK NODES TO EXPLORE • DRAG TO NAVIGATE
                    </p>
                    <div className="mt-4 h-1 w-24 mx-auto bg-linear-to-r from-transparent via-game-primary to-transparent" />
                </animated.div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
                    {Object.entries(levelColors).map(([level, color]) => (
                        <div key={level} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-game-text-muted">
                                {level}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Tree Container */}
                <animated.div
                    ref={treeContainerRef}
                    style={treeSpring}
                    className="flex-1 relative rounded-lg overflow-hidden bg-frost-glass/30 backdrop-blur-sm"
                >
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={translate}
                        separation={{ siblings: 1.2, nonSiblings: 1.5 }}
                        nodeSize={{ x: 140, y: 180 }}
                        renderCustomNodeElement={(props) => (
                            <CustomNode
                                {...props}
                                onSkillClick={handleNodeClick}
                            />
                        )}
                        pathClassFunc={() => 'skill-tree-link'}
                        enableLegacyTransitions
                        transitionDuration={300}
                        collapsible={true}
                        initialDepth={2}
                        zoom={zoom}
                        scaleExtent={{ min: 0.3, max: 2 }}
                    />

                    {/* Skill Detail Panel */}
                    <SkillDetail
                        skill={selectedSkill}
                        onClose={() => setSelectedSkill(null)}
                    />
                </animated.div>
            </div>

            {/* Custom styles for tree links */}
            <style>{`
                .skill-tree-link {
                    stroke: rgba(180, 220, 255, 0.5) !important;
                    stroke-width: 2 !important;
                }
            `}</style>
        </div>
    );
};

export default SkillPage;
