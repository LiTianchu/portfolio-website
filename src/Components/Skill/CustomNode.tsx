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
                    {nodeDatum.__rd3t?.collapsed ? '+' : '��?'}
                </text>
            )}
        </g>
    );
};
export default CustomNode;
