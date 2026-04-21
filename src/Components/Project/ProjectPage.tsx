import { useEffect, useState } from 'react';
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

export interface ImageSrcSet {
    desktop: string;
    tablet?: string;
    mobile?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    /** Resolved after loading — each entry carries desktop/tablet/mobile URLs. */
    images?: ImageSrcSet[];
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

// vite glob import for images — includes both originals and -mobile variants
const imageModules = import.meta.glob('@assets/images/**/*', {
    eager: true,
    query: '?url',
    import: 'default',
});

/** Return true when the screen width is in the mobile range (≤768px). */
function detectMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
}

const IS_MOBILE = detectMobile();
const IS_TABLET =
    !IS_MOBILE && typeof window !== 'undefined' && window.innerWidth <= 1280;

/**
 * Build an ImageSrcSet for a filename (e.g. "lie/desktop.png").
 * All available variants are returned; the browser picks the right one
 * via <picture> <source media="…"> in SlideShow.
 */
function getImageSrcSet(filename: string): ImageSrcSet {
    const desktop = imageModules[`/src/assets/images/${filename}`] as string;
    const ext = filename.slice(filename.lastIndexOf('.'));
    const stem = filename.slice(0, filename.lastIndexOf('.'));
    const tabletKey = `/src/assets/images/${stem}-tablet${ext}`;
    const mobileKey = `/src/assets/images/${stem}-mobile${ext}`;
    return {
        desktop,
        tablet: (imageModules[tabletKey] as string) ?? undefined,
        mobile: (imageModules[mobileKey] as string) ?? undefined,
    };
}

/**
 * Return a single URL appropriate for the current device.
 * Used for thumbnails in ProjectCard where srcset is not needed.
 */
function getImageUrl(filename: string): string {
    const base = `/src/assets/images/${filename}`;
    if (IS_MOBILE || IS_TABLET) {
        const ext = filename.slice(filename.lastIndexOf('.'));
        const stem = filename.slice(0, filename.lastIndexOf('.'));
        const suffix = IS_MOBILE ? '-mobile' : '-tablet';
        const variantKey = `/src/assets/images/${stem}${suffix}${ext}`;
        if (imageModules[variantKey]) return imageModules[variantKey] as string;
    }
    return imageModules[base] as string;
}

function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

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
        const projectsData = (
            projectsJSON as unknown as { projects: Project[] }
        ).projects;
        const projectsWithPathResolved = projectsData.map((project) => {
            if (project.images && project.images.length > 0) {
                return {
                    ...project,
                    thumbnail: getImageUrl(project.thumbnail),
                    images: project.images.map((img) =>
                        getImageSrcSet(img as unknown as string)
                    ),
                };
            }
            return project;
        });
        setProjects(projectsWithPathResolved);
    }, []);

    return (
        <div className="page-container overflow-y-auto">
            <div className="content-container glass-panel-dark p-8 relative">
                <BackButton />
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
}

export default ProjectPage;
