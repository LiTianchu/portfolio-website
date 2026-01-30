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

    // Wrap text if too long (split into lines)
    const wrapText = (text: string, maxChars: number = 12): string[] => {
        if (text.length <= maxChars) return [text];

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (testLine.length <= maxChars) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) lines.push(currentLine);
        return lines.slice(0, 2); // Max 2 lines
    };

    const textLines = wrapText(nodeDatum.name, 16);

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
                x="-70"
                y="-35"
                width="140"
                height="70"
                rx="12"
                fill="rgba(25, 40, 60, 0.85)"
                stroke={levelColors[level]}
                strokeWidth="1.5"
                filter="url(#glow)"
                style={{ cursor: 'pointer' }}
                onClick={handleClick}
            />

            {/* Name */}
            <text
                x="0"
                y={textLines.length === 1 ? -5 : -12}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{
                    pointerEvents: 'none',
                    fill: '#ffffff',
                    stroke: 'none',
                }}
            >
                {textLines.map((line, i) => (
                    <tspan key={i} x="0" dy={i === 0 ? 0 : 14}>
                        {line}
                    </tspan>
                ))}
            </text>

            {/* Level badge */}
            <text
                x="0"
                y={textLines.length === 1 ? 12 : 18}
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
                    cx="57"
                    cy="0"
                    r="10"
                    fill="rgba(168, 212, 240, 0.2)"
                    stroke="rgba(168, 212, 240, 0.6)"
                    strokeWidth="1"
                />
            )}
            {hasChildren && (
                <text
                    x="57"
                    y="3"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                        pointerEvents: 'none',
                        fill: 'rgba(168, 212, 240, 0.9)',
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
