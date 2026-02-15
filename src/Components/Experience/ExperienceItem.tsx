import { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import {
    Calendar,
    MapPin,
    Award,
    CheckCircle,
    Briefcase,
    BookOpen,
    Activity,
    Heart,
} from 'react-feather';

export interface ExperienceItemProps {
    title: string;
    occupationType: string;
    organizationName: string;
    startDate: string;
    endDate: string | 'Current';
    location: string;
    type: 'Work' | 'Education' | 'Activity' | 'Hobby';
    descPoints?: string[];
    achievements?: string[];
}

function ExperienceItem({
    title,
    occupationType,
    organizationName,
    startDate,
    endDate,
    location,
    type,
    descPoints,
    achievements,
}: ExperienceItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const formatDate = (dateStr: string) => {
        // Handle 'Forgot When' or other non-date strings
        if (!dateStr || dateStr === 'Forgot When') {
            return dateStr;
        }

        // Parse date formats like 'Aug 2025' or 'Jul 2025'
        const monthYearMatch = dateStr.match(/^([A-Za-z]{3})\s+(\d{4})$/);
        if (monthYearMatch) {
            const [, month, year] = monthYearMatch;
            const monthMap: { [key: string]: string } = {
                Jan: '01',
                Feb: '02',
                Mar: '03',
                Apr: '04',
                May: '05',
                Jun: '06',
                Jul: '07',
                Aug: '08',
                Sep: '09',
                Oct: '10',
                Nov: '11',
                Dec: '12',
            };
            const monthNum = monthMap[month];
            if (monthNum) {
                // Create ISO format date string
                const isoDateStr = `${year}-${monthNum}-01`;
                const date = new Date(isoDateStr);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                    });
                }
            }
        }

        // Try parsing as a standard date
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            });
        }

        // If all else fails, return the original string
        return dateStr;
    };

    const hoverSpring = useSpring({
        scale: hovered ? 1.02 : 1,
        borderColor: hovered
            ? 'rgba(0, 212, 255, 0.8)'
            : 'rgba(0, 212, 255, 0.3)',
        config: config.gentle,
    });

    const expandSpring = useSpring({
        height: expanded ? 'auto' : 0,
        opacity: expanded ? 1 : 0,
        config: config.gentle,
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
                    <span className="text-game-success text-xs md:font-semibold">
                        ACTIVE
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="mb-3">
                <h3 className="text-lg md:text-xl font-bold text-game-text-primary group-hover:text-game-primary transition-colors">
                    {title}
                </h3>
                <div className="flex flex-wrap flex-col lg:flex-row items-start lg:items-center gap-1 md:gap-2 mt-1">
                    <span className="text-game-primary text-sm md:text-base font-semibold">
                        {organizationName}
                    </span>
                    <span className="text-game-text-muted hidden lg:inline">
                        •
                    </span>
                    <span className="text-game-text-secondary text-xs md:text-sm">
                        {occupationType}
                    </span>
                </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-col lg:flex-row gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-game-text-secondary">
                    <span className="flex items-center">
                        <Calendar size={18} />
                    </span>
                    <div>
                        <p className="inline">
                            {startDate !== 'Forgot When'
                                ? formatDate(startDate)
                                : 'Forgot When'}{' '}
                        </p>
                        <p className="inline">- </p>
                        <p className="inline">
                            {isActive ? (
                                <span className="text-game-success">
                                    Present
                                </span>
                            ) : (
                                formatDate(endDate)
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-game-text-secondary">
                    <span className="flex items-center">
                        <MapPin size={18} />
                    </span>
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-game-text-secondary">
                    <span className="flex items-center">
                        {type === 'Work' ? (
                            <Briefcase size={18} />
                        ) : type === 'Education' ? (
                            <BookOpen size={18} />
                        ) : type === 'Activity' ? (
                            <Activity size={18} />
                        ) : type === 'Hobby' ? (
                            <Heart size={18} />
                        ) : null}
                    </span>
                    <span>{type}</span>
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
                            QUEST LOG
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
}

export default ExperienceItem;
