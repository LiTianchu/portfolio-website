import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import type { SkillNode, SkillAttributes } from './SkillPage';
import { levelColors } from './SkillPage';
interface SkillDetailProps {
    skill: SkillNode | null;
    onClose: () => void;
}

const getSkillIcon = (attributes?: SkillAttributes) => {
    const icon = attributes?.icon;
    return typeof icon === 'string' ? icon : undefined;
};
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
                �?{' '}
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
export default SkillDetail;
