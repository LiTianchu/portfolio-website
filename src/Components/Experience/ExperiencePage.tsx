import React from 'react';
import { useState, useEffect } from 'react';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import ExperienceItem from './ExperienceItem';
import type { ExperienceItemProps } from './ExperienceItem';
import experiencesJSON from '@assets/experiences.json';
import BackButton from '@comp/Common/BackButton';

const ExperiencePage: React.FC = () => {
    const [experienceItems, setExperienceItems] = useState<
        ExperienceItemProps[]
    >([]);

    const loadExperienceItems = () => {
        const experiences = experiencesJSON as {
            experiences: ExperienceItemProps[];
        };
        setExperienceItems(experiences.experiences || []);
    };

    useEffect(() => {
        loadExperienceItems();
    }, []);

    const headerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const trail = useTrail(experienceItems.length, {
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0 },
        delay: 200,
        config: config.gentle,
    });

    return (
        <div className="page-container overflow-y-auto">
            <div className="content-container glass-panel-dark p-8">
                <div className="mb-6 flex justify-start">
                    <BackButton />
                </div>
                {/* Header - Save Screen Style */}
                <animated.div style={headerSpring} className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-game-primary glow-text">
                            SAVE
                        </span>
                        <span className="text-game-text-primary"> DATA</span>
                    </h1>
                    <p className="text-game-text-secondary tracking-wider">
                        CAREER MILESTONES & ACHIEVEMENTS
                    </p>
                    <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-game-primary to-transparent" />
                </animated.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-game-primary via-game-secondary to-game-primary/20" />

                    {/* Experience Items */}
                    <div className="space-y-8">
                        {experienceItems.length > 0 ? (
                            trail.map((style, index) => (
                                <animated.div
                                    key={`${experienceItems[index].title}-${index}`}
                                    style={style}
                                    className={`relative flex items-center ${
                                        index % 2 === 0
                                            ? 'md:flex-row'
                                            : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Save slot number */}
                                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-game-bg-dark border-2 border-game-primary flex items-center justify-center z-10">
                                        <span className="text-game-primary font-bold text-sm">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={`ml-14 md:ml-0 md:w-1/2 ${
                                            index % 2 === 0
                                                ? 'md:pr-12'
                                                : 'md:pl-12'
                                        }`}
                                    >
                                        <ExperienceItem
                                            {...experienceItems[index]}
                                        />
                                    </div>
                                </animated.div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-game-text-muted text-lg">
                                    NO SAVE DATA FOUND
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats footer */}
                <animated.div
                    style={headerSpring}
                    className="mt-12 flex justify-center gap-8 text-sm border-t border-game-glass-border pt-6"
                >
                    <div className="text-center">
                        <p className="text-game-primary text-2xl font-bold">
                            {experienceItems.length}
                        </p>
                        <p className="text-game-text-muted">Total Roles</p>
                    </div>
                    <div className="text-center">
                        <p className="text-game-success text-2xl font-bold">
                            {
                                experienceItems.filter(
                                    (e) => e.endDate === 'Current'
                                ).length
                            }
                        </p>
                        <p className="text-game-text-muted">Active</p>
                    </div>
                </animated.div>
            </div>
        </div>
    );
};

export default ExperiencePage;
