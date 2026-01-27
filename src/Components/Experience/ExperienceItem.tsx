import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Calendar, MapPin, Award, CheckCircle } from 'react-feather';

export interface ExperienceItemProps {
    title: string;
    occupationType: string;
    organizationName: string;
    startDate: string;
    endDate: string | 'Current';
    location: string;
    descPoints?: string[];
    achievements?: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
    title,
    occupationType,
    organizationName,
    startDate,
    endDate,
    location,
    descPoints,
    achievements,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const hoverSpring = useSpring({
        scale: hovered ? 1.02 : 1,
        borderColor: hovered
            ? 'rgba(0, 212, 255, 0.8)'
            : 'rgba(0, 212, 255, 0.3)',
        config: { tension: 300, friction: 20 },
    });

    const expandSpring = useSpring({
        height: expanded ? 'auto' : 0,
        opacity: expanded ? 1 : 0,
        config: { tension: 250, friction: 25 },
    });

    const isActive = endDate === 'Current';

    return (
        <animated.div
            style={{
                transform: hoverSpring.scale.to((s) => `scale(${s})`),
                borderColor: hoverSpring.borderColor,
            }}
            className="game-card p-6 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-game-success animate-pulse" />
                    <span className="text-game-success text-xs font-semibold">
                        ACTIVE
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="mb-3">
                <h3 className="text-xl font-bold text-game-text-primary group-hover:text-game-primary transition-colors">
                    {title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-game-primary font-semibold">
                        {organizationName}
                    </span>
                    <span className="text-game-text-muted">•</span>
                    <span className="text-game-text-secondary text-sm">
                        {occupationType}
                    </span>
                </div>
            </div>

            {/* Meta info */}
            <div className="flex gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-game-text-secondary">
                    <span className="flex items-center">
                        <Calendar size={18} />
                    </span>
                    <span>
                        {formatDate(startDate)} -{' '}
                        {isActive ? (
                            <span className="text-game-success">Present</span>
                        ) : (
                            formatDate(endDate)
                        )}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-game-text-secondary">
                    <span className="flex items-center">
                        <MapPin size={18} />
                    </span>
                    <span>{location}</span>
                </div>
            </div>

            {/* Expandable content */}
            <animated.div
                style={{
                    overflow: 'hidden',
                    ...expandSpring,
                }}
            >
                {descPoints && descPoints.length > 0 && (
                    <div className="mb-4 pt-4 border-t border-game-glass-border">
                        <h4 className="text-sm font-semibold text-game-text-primary mb-2 tracking-wider">
                            MISSION LOG
                        </h4>
                        <ul className="space-y-2">
                            {descPoints.map((point, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-game-text-secondary text-sm"
                                >
                                    <span className="text-game-primary mt-1">
                                        <CheckCircle size={12} />
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {achievements && achievements.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-game-text-primary mb-2 tracking-wider">
                            ACHIEVEMENTS UNLOCKED
                        </h4>
                        <ul className="space-y-2">
                            {achievements.map((achievement, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-game-text-secondary text-sm"
                                >
                                    <span className="text-game-warning">
                                        <Award size={12} />
                                    </span>
                                    {achievement}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </animated.div>

            {/* Expand hint */}
            <div className="mt-4 text-center">
                <span className="text-game-text-muted text-xs tracking-wider">
                    {expanded ? '▲ COLLAPSE' : '▼ EXPAND FOR DETAILS'}
                </span>
            </div>
        </animated.div>
    );
};

export default ExperienceItem;
