import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import type { Project } from './ProjectPage';
import { X } from 'react-feather';
import { typeColors, statusColors } from './ProjectPage';
import SlideShow from './SlideShow';

interface ProjectDetailProps {
    project: Project;
    onClose: () => void;
}

function ProjectDetail({ project, onClose }: ProjectDetailProps) {
    const modalSpring = useSpring({
        from: { opacity: 0, scale: 0.9, y: 20 },
        to: { opacity: 1, scale: 1, y: 0 },
        config: config.gentle,
    });

    const backdropSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
    });

    return (
        <animated.div
            style={backdropSpring}
            className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/70"
            onClick={onClose}
        >
            <animated.div
                style={modalSpring}
                className="glass-panel-dark-opaque p-8 xl:max-w-[60vw] lg:max-w-[70vw] md:max-w-[80vw] max-w-[90vw] w-full max-h-[90vh] overflow-y-auto scrollbar-game"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h2 className="text-3xl font-bold text-game-primary">
                                    {project.title}
                                </h2>
                                <div>
                                    {/*Project Type*/}
                                    <span
                                        className={`text-sm ${typeColors[project.type]}`}
                                    >
                                        {project.type}
                                    </span>
                                    <span className="mx-3">•</span>
                                    {/* Status */}
                                    <span
                                        className={`text-sm ${statusColors[project.status]}`}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-game-text-muted hover:text-game-primary text-2xl transition-colors"
                    >
                        <X size={30} />
                    </button>
                </div>

                {project.images && project.images.length > 0 && (
                    <div className="mb-6">
                        <SlideShow
                            images={project.images}
                            imagesFit={project.imagesFit}
                        />
                    </div>
                )}

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-game-text-primary mb-2">
                        Overview
                    </h3>
                    <p className="text-game-text-secondary text-sm md:text-base leading-relaxed">
                        {project.longDescription
                            .split('\n')
                            .map((segment, i, arr) => (
                                <React.Fragment key={i}>
                                    {segment}
                                    {i < arr.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                    </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-game-text-primary mb-2">
                        Feature Highlights
                    </h3>
                    <ul className="text-sm md:text-base list-disc list-inside space-y-2 text-game-text-secondary">
                        {project.features.map((feature, index) => (
                            <li key={index} className="leading-relaxed">
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-game-text-primary mb-2">
                        TECH STACK
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 bg-game-primary/20 border border-game-primary/50 rounded text-game-primary text-xs md:text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="flex gap-4">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="game-button hover:game-button-hover rounded-lg"
                        >
                            GitHub{' '}
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="game-button hover:game-button-hover rounded-lg bg-game-secondary/20 border-game-secondary text-game-secondary"
                        >
                            Live{' '}
                        </a>
                    )}
                </div>
            </animated.div>
        </animated.div>
    );
}

export default ProjectDetail;
