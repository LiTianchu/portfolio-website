import React, { useEffect, useState } from 'react';
import { useSpring, animated, useSprings, config } from '@react-spring/web';
import projectsJSON from '@assets/projects.json';
import BackButton from '@comp/Common/BackButton';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

export const typeColors: Record<string, string> = {
    Game: 'text-game-success',
    Web: 'text-game-warning',
    Graphics: 'text-game-accent',
    Application: 'text-game-danger',
    Art: 'text-game-primary',
    Library: 'text-game-info',
    Misc: 'text-game-text-muted',
};

export const statusColors: Record<string, string> = {
    Completed: 'text-game-success',
    'In Progress': 'text-game-warning',
    Planned: 'text-game-text-muted',
};

export interface Project {
    id: string;
    title: string;
    description: string;
    images?: string[];
    longDescription: string;
    thumbnail: string;
    thumbnailFit?: 'cover' | 'contain';
    imagesFit?: 'cover' | 'contain';
    technologies: string[];
    type:
        | 'Game'
        | 'Web'
        | 'Graphics'
        | 'Application'
        | 'Art'
        | 'Library'
        | 'Misc';
    status: 'Completed' | 'In Progress' | 'Planned';
    githubUrl?: string;
    liveUrl?: string;
    features: string[];
}
// vite glob import for images
const imageModules = import.meta.glob('@assets/images/**/*', {
    eager: true,
    query: '?url',
    import: 'default',
});
const ProjectPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

    const getImageUrl = (filename: string) => {
        const path = `/src/assets/images/${filename}`;
        return imageModules[path] as string;
    };

    const headerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const springs = useSprings(
        projects.length,
        projects.map((_, index) => ({
            from: { opacity: 0, y: 20 },
            to: { opacity: 1, y: 0 },
            delay: 100 + index * 60,
            config: config.gentle,
        }))
    );

    // replace image urls
    useEffect(() => {
        const projectsData = (projectsJSON as { projects: Project[] }).projects;
        const projectsWithPathResolved = projectsData.map((project) => {
            if (project.images && project.images.length > 0) {
                return {
                    ...project,
                    thumbnail: getImageUrl(project.thumbnail),
                    images: project.images.map((img) => getImageUrl(img)),
                };
            }
            return project;
        });
        setProjects(projectsWithPathResolved);
    }, []);

    return (
        <div className="page-container overflow-y-auto">
            <div className="content-container glass-panel-dark p-8 ">
                <div className="mb-3 flex justify-start">
                    <BackButton />
                </div>
                {/* Header */}
                <animated.div style={headerSpring} className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="text-game-primary glow-text">
                            LEVEL
                        </span>
                        <span className="text-game-text-primary"> SELECT</span>
                    </h1>
                    <p className="text-game-text-secondary md:text-lg sm:text-base text-sm tracking-wider">
                        CHOOSE A PROJECT TO EXPLORE
                    </p>
                    <div className="mt-4 h-1 w-24 mx-auto bg-linear-to-r from-transparent via-game-primary to-transparent" />
                </animated.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {springs.map((style, index) => (
                        <ProjectCard
                            key={index}
                            project={projects[index]}
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
                        <p className="text-game-text-muted text-xs md:text-sm whitespace-nowrap">
                            Total Projects
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-game-success text-2xl font-bold">
                            {
                                projects.filter((p) => p.status === 'Completed')
                                    .length
                            }
                        </p>
                        <p className="text-game-text-muted text-xs md:text-sm whitespace-nowrap">
                            Completed
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-game-warning text-2xl font-bold">
                            {
                                projects.filter(
                                    (p) => p.status === 'In Progress'
                                ).length
                            }
                        </p>
                        <p className="text-game-text-muted text-xs md:text-sm whitespace-nowrap">
                            In Progress
                        </p>
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
