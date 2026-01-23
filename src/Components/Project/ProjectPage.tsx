import React, { useState } from 'react';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import projectsJSON from '@assets/projects.json';
import BackButton from '@comp/Common/BackButton';

export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    thumbnail: string;
    technologies: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    status: 'Completed' | 'In Progress' | 'Planned';
    githubUrl?: string;
    liveUrl?: string;
    features: string[];
}

interface ProjectCardProps {
    project: Project;
    index: number;
    onClick: (project: Project) => void;
    style: { opacity: number; y: number };
}

const difficultyColors: Record<string, string> = {
    Beginner: 'text-game-success',
    Intermediate: 'text-game-warning',
    Advanced: 'text-game-accent',
    Expert: 'text-game-danger',
};

const statusColors: Record<string, string> = {
    Completed: 'bg-game-success/20 text-game-success',
    'In Progress': 'bg-game-warning/20 text-game-warning',
    Planned: 'bg-game-text-muted/20 text-game-text-muted',
};

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    index,
    onClick,
    style,
}) => {
    const [hovered, setHovered] = useState(false);

    const hoverSpring = useSpring({
        scale: hovered ? 1.02 : 1,
        y: hovered ? -5 : 0,
        config: { tension: 300, friction: 20 },
    });

    return (
        <animated.div
            style={{
                opacity: style.opacity,
                transform: hoverSpring.scale.to(
                    (s) =>
                        `scale(${s}) translateY(${style.y + hoverSpring.y.get()}px)`
                ),
            }}
            className="game-card p-6 cursor-pointer hover:border-game-primary relative overflow-hidden group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(project)}
        >
            {/* Level number badge */}
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-game-primary/20 border border-game-primary flex items-center justify-center">
                <span className="text-game-primary text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Status badge */}
            <div className="absolute top-3 right-3">
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[project.status]}`}
                >
                    {project.status}
                </span>
            </div>

            {/* Thumbnail */}
            <div className="text-6xl text-center my-6">{project.thumbnail}</div>

            {/* Title */}
            <h3 className="text-xl font-bold text-game-text-primary text-center mb-2 group-hover:text-game-primary transition-colors">
                {project.title}
            </h3>

            {/* Difficulty */}
            <p
                className={`text-center text-sm mb-3 ${difficultyColors[project.difficulty]}`}
            >
                ★ {project.difficulty}
            </p>

            {/* Description */}
            <p className="text-game-text-secondary text-sm text-center line-clamp-2">
                {project.description}
            </p>

            {/* Tech stack preview */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {project.technologies.slice(0, 3).map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-game-bg-light rounded text-game-text-muted"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-game-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </animated.div>
    );
};

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
                                    className={`text-sm ${difficultyColors[project.difficulty]}`}
                                >
                                    ★ {project.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-game-text-muted hover:text-game-primary text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

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
                        MISSION BRIEFING
                    </h3>
                    <p className="text-game-text-secondary leading-relaxed">
                        {project.longDescription}
                    </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-game-text-primary mb-2">
                        OBJECTIVES
                    </h3>
                    <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2 text-game-text-secondary"
                            >
                                <span className="text-game-success">✓</span>
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
                            GitHub ↗
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="game-button hover:game-button-hover rounded-lg bg-game-secondary/20 border-game-secondary text-game-secondary"
                        >
                            Live Demo ↗
                        </a>
                    )}
                </div>
            </animated.div>
        </animated.div>
    );
};

const ProjectPage: React.FC = () => {
    const [projects] = useState<Project[]>(
        (projectsJSON as { projects: Project[] }).projects || []
    );
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

    const headerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const trail = useTrail(projects.length, {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0 },
        delay: 200,
        config: config.gentle,
    });

    return (
        <div className="page-container overflow-y-auto">
            <div className="content-container glass-panel-dark p-8">
                <div className="mb-6 flex justify-start">
                    <BackButton />
                </div>
                {/* Header */}
                <animated.div style={headerSpring} className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-game-primary glow-text">
                            LEVEL
                        </span>
                        <span className="text-game-text-primary"> SELECT</span>
                    </h1>
                    <p className="text-game-text-secondary tracking-wider">
                        CHOOSE A PROJECT TO EXPLORE
                    </p>
                    <div className="mt-4 h-1 w-24 mx-auto bg-linear-to-r from-transparent via-game-primary to-transparent" />
                </animated.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trail.map((style, index) => (
                        <ProjectCard
                            key={projects[index].id}
                            project={projects[index]}
                            index={index}
                            onClick={setSelectedProject}
                            style={{
                                opacity: style.opacity.get(),
                                y: style.y.get(),
                            }}
                        />
                    ))}
                </div>

                {/* Stats footer */}
                <div className="mt-8 flex justify-center gap-8 text-sm">
                    <div className="text-center">
                        <p className="text-game-primary text-2xl font-bold">
                            {projects.length}
                        </p>
                        <p className="text-game-text-muted">Total Projects</p>
                    </div>
                    <div className="text-center">
                        <p className="text-game-success text-2xl font-bold">
                            {
                                projects.filter((p) => p.status === 'Completed')
                                    .length
                            }
                        </p>
                        <p className="text-game-text-muted">Completed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-game-warning text-2xl font-bold">
                            {
                                projects.filter(
                                    (p) => p.status === 'In Progress'
                                ).length
                            }
                        </p>
                        <p className="text-game-text-muted">In Progress</p>
                    </div>
                </div>
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
};

export default ProjectPage;
