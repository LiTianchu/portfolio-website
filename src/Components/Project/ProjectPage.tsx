import React, { useState } from 'react';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import projectsJSON from '@assets/projects.json';
import BackButton from '@comp/Common/BackButton';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

export const difficultyColors: Record<string, string> = {
    Beginner: 'text-game-success',
    Intermediate: 'text-game-warning',
    Advanced: 'text-game-accent',
    Expert: 'text-game-danger',
};

export const statusColors: Record<string, string> = {
    Completed: 'bg-game-success/20 text-game-success',
    'In Progress': 'bg-game-warning/20 text-game-warning',
    Planned: 'bg-game-text-muted/20 text-game-text-muted',
};

export interface Project {
    id: string;
    title: string;
    description: string;
    images?: string[];
    longDescription: string;
    thumbnail: string;
    technologies: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    status: 'Completed' | 'In Progress' | 'Planned';
    githubUrl?: string;
    liveUrl?: string;
    features: string[];
}

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
        delay: 0,
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
                            style={style}
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
