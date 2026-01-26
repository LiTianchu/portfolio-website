import React, { useState, useCallback } from 'react';
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
    Master: '#00d4ff',
    Expert: '#00ff88',
    Advanced: '#ffb800',
    Intermediate: '#ff6b35',
    Beginner: '#ff3366',
};

const SkillPage: React.FC = () => {
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
    const [treeData] = useState<RawNodeDatum>(
        (skillsJSON as { skillTree: RawNodeDatum }).skillTree
    );

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
            <div className="content-container glass-panel-dark p-8 h-[85vh] flex flex-col">
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
                    style={treeSpring}
                    className="flex-1 relative rounded-lg overflow-hidden bg-game-bg-dark/50"
                >
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: 400, y: 80 }}
                        separation={{ siblings: 1.5, nonSiblings: 2 }}
                        nodeSize={{ x: 160, y: 100 }}
                        renderCustomNodeElement={(props) => (
                            <CustomNode
                                {...props}
                                onSkillClick={handleNodeClick}
                            />
                        )}
                        pathClassFunc={() => 'skill-tree-link'}
                        enableLegacyTransitions
                        transitionDuration={300}
                        collapsible
                        initialDepth={1}
                        zoom={0.8}
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
                    stroke: rgba(0, 212, 255, 0.4) !important;
                    stroke-width: 2 !important;
                }
            `}</style>
        </div>
    );
};

export default SkillPage;
