import React from 'react';
import type { CustomNodeElementProps } from 'react-d3-tree';
import type { SkillNode, SkillAttributes } from './SkillPage';
import { levelColors } from './SkillPage';

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

            {/* Name */}
            <text
                x="0"
                y="-5"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{
                    pointerEvents: 'none',
                    fill: '#ffffff',
                    stroke: 'none',
                }}
            >
                {nodeDatum.name}
            </text>

            {/* Level badge */}
            <text
                x="0"
                y="12"
                fontSize="9"
                textAnchor="middle"
                style={{
                    pointerEvents: 'none',
                    fill: levelColors[level] || '#7ed7d9',
                    stroke: 'none',
                }}
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
                    y="3"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                        pointerEvents: 'none',
                        fill: '#00d4ff',
                        stroke: 'none',
                    }}
                >
                    {nodeDatum.__rd3t?.collapsed ? '+' : '-'}
                </text>
            )}
        </g>
    );
};
export default CustomNode;
