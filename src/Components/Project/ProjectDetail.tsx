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

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <animated.div
                style={modalSpring}
                className="glass-panel-dark p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-game"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">
                                {project.thumbnail}
                            </span>
                            <div>
                                <h2 className="text-3xl font-bold text-game-primary">
                                    {project.title}
                                </h2>
                                <span
                                    className={`text-sm ${typeColors[project.type]}`}
                                >
                                    {project.type}
                                </span>
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
                        <SlideShow images={project.images} />
                    </div>
                )}

                {/* Status */}
                <div className="mb-6">
                    <span
                        className={`px-3 py-1 rounded ${statusColors[project.status]}`}
                    >
                        {project.status}
                    </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-game-text-primary mb-2">
                        Overview
                    </h3>
                    <p className="text-game-text-secondary leading-relaxed">
                        {project.longDescription}
                    </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-game-text-primary mb-2">
                        Feature Highlights
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-game-text-secondary">
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
                                className="px-3 py-1 bg-game-primary/20 border border-game-primary/50 rounded text-game-primary text-sm"
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
                            Demo{' '}
                        </a>
                    )}
                </div>
            </animated.div>
        </animated.div>
    );
};

export default ProjectDetail;
