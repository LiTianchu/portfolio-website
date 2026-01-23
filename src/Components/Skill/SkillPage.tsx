import React, { useState, useCallback } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import Tree from 'react-d3-tree';
import type { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import skillsJSON from '@assets/skills.json';
import BackButton from '@comp/Common/BackButton';

type SkillAttributes = Record<string, string | number | boolean>;

interface SkillNode extends RawNodeDatum {
    name: string;
    attributes?: SkillAttributes;
    children?: SkillNode[];
}

const levelColors: Record<string, string> = {
    Master: '#00d4ff',
    Expert: '#00ff88',
    Advanced: '#ffb800',
    Intermediate: '#ff6b35',
    Beginner: '#ff3366',
};

const getSkillIcon = (attributes?: SkillAttributes) => {
    const icon = attributes?.icon;
    return typeof icon === 'string' ? icon : undefined;
};

type CustomNodeProps = CustomNodeElementProps & {
    onSkillClick?: (node: SkillNode) => void;
};

const CustomNode: React.FC<CustomNodeProps> = ({
    nodeDatum,
    toggleNode,
    onSkillClick,
}) => {
    const attributes = nodeDatum.attributes as SkillAttributes | undefined;
    const level = (attributes?.level as string) || 'Intermediate';
    const icon = (attributes?.icon as string) || '📦';
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSkillClick?.(nodeDatum as SkillNode);
    };

    return (
        <g onClick={toggleNode}>
            {/* Connection line glow */}
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Node background */}
            <rect
                x="-60"
                y="-30"
                width="120"
                height="60"
                rx="8"
                fill="rgba(20, 20, 35, 0.9)"
                stroke={levelColors[level]}
                strokeWidth="2"
                filter="url(#glow)"
                style={{ cursor: 'pointer' }}
                onClick={handleClick}
            />

            {/* Icon */}
            <text
                x="-45"
                y="5"
                fontSize="20"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
            >
                {icon}
            </text>

            {/* Name */}
            <text
                x="10"
                y="-5"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
            >
                {nodeDatum.name}
            </text>

            {/* Level badge */}
            <text
                x="10"
                y="12"
                fill={levelColors[level]}
                fontSize="9"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
            >
                {level}
            </text>

            {/* Expand indicator */}
            {hasChildren && (
                <circle
                    cx="50"
                    cy="0"
                    r="8"
                    fill="rgba(0, 212, 255, 0.3)"
                    stroke="#00d4ff"
                    strokeWidth="1"
                />
            )}
            {hasChildren && (
                <text
                    x="50"
                    y="4"
                    fill="#00d4ff"
                    fontSize="10"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                >
                    {nodeDatum.__rd3t?.collapsed ? '+' : '−'}
                </text>
            )}
        </g>
    );
};

interface SkillDetailProps {
    skill: SkillNode | null;
    onClose: () => void;
}

const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onClose }) => {
    const modalSpring = useSpring({
        from: { opacity: 0, scale: 0.9 },
        to: { opacity: skill ? 1 : 0, scale: skill ? 1 : 0.9 },
        config: config.gentle,
    });

    if (!skill) return null;

    const attributes = (skill.attributes || {}) as SkillAttributes;
    const level = (attributes.level as string) || 'Intermediate';

    return (
        <animated.div
            style={modalSpring}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel-dark p-6 min-w-75 z-20"
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-game-text-muted hover:text-game-primary"
            >
                ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">
                    {(attributes.icon as string) || '📦'}
                </span>
                <div>
                    <h3 className="text-xl font-bold text-game-text-primary">
                        {skill.name}
                    </h3>
                    <span
                        className="text-sm font-semibold"
                        style={{ color: levelColors[level] }}
                    >
                        {level}
                    </span>
                </div>
            </div>
            {attributes.description && (
                <p className="text-game-text-secondary text-sm mb-3">
                    {attributes.description as string}
                </p>
            )}
            {attributes.years && (
                <div className="flex items-center gap-2 text-game-text-muted text-sm">
                    <span>⏱️</span>
                    <span>{attributes.years as number} years experience</span>
                </div>
            )}
            {skill.children && skill.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-game-glass-border">
                    <p className="text-game-text-muted text-xs mb-2">
                        SUB-SKILLS
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {skill.children.map((child) => {
                            const childIcon = getSkillIcon(
                                child.attributes as SkillAttributes | undefined
                            );
                            return (
                                <span
                                    key={child.name}
                                    className="px-2 py-1 bg-game-bg-light rounded text-xs text-game-text-secondary"
                                >
                                    {childIcon ? `${childIcon} ` : ''}
                                    {child.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </animated.div>
    );
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
