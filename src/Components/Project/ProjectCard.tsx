import React, { useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { typeColors, statusColors } from './ProjectPage';
import type { Project } from './ProjectPage';
import type { SpringValue } from '@react-spring/web';
import { Monitor, Package, Calendar } from 'react-feather';

interface ProjectCardProps {
    project: Project;
    onClick: (project: Project) => void;
    style: { opacity: SpringValue<number>; y: SpringValue<number> };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onClick,
    style,
}) => {
    const [hovered, setHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const hoverSpring = useSpring({
        scale: hovered ? 1.02 : 1,
        y: hovered ? -5 : 0,
        config: { tension: 300, friction: 20 },
    });

    return (
        <animated.div
            style={{
                opacity: style.opacity,
                transform: to(
                    [style.y, hoverSpring.scale, hoverSpring.y],
                    (trailY, scale, hoverY) =>
                        `translateY(${trailY + hoverY}px) scale(${scale})`
                ),
            }}
            className="game-card p-6 cursor-pointer hover:border-game-primary relative overflow-hidden group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(project)}
        >
            {/* Status badge */}
            <div className="flex justify-between items-center mb-2">
                {/* type */}
                <p
                    className={`text-center text-sm ${typeColors[project.type]}`}
                >
                    {project.type}
                </p>
                <div
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold ${statusColors[project.status]}`}
                >
                    {project.status === 'In Progress' ? (
                        <Monitor size={12} />
                    ) : project.status === 'Completed' ? (
                        <Package size={12} />
                    ) : (
                        <Calendar size={12} />
                    )}
                    {project.status}
                </div>
            </div>

            {/* Thumbnail */}
            <div className="w-full h-40 mb-4 relative overflow-hidden rounded-md bg-transparent">
                {!project.thumbnail || imageError ? (
                    <div className="flex items-center justify-center w-full h-full text-game-text-muted">
                        <span className="text-sm">Image unavailable</span>
                    </div>
                ) : (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-game-bg-dark animate-pulse" />
                        )}
                        <img
                            src={project.thumbnail}
                            alt={`${project.title} thumbnail`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                                project.thumbnailFit === 'contain'
                                    ? 'object-contain'
                                    : 'object-cover'
                            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </>
                )}
            </div>

            <div className="flex justify-between items-center">
                {/* Title */}
                <h3 className="text-xl font-bold text-game-text-primary text-center mb-2 group-hover:text-game-primary transition-colors">
                    {project.title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-game-text-secondary text-sm text-left line-clamp-2">
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
export default ProjectCard;
