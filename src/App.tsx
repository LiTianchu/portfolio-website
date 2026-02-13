import React, { Suspense, lazy } from 'react';
import { useTransition, animated, config } from '@react-spring/web';
import { useAppSelector } from '@states/hook';
import Background3D from '@comp/Common/Background3D';
import RendererMain from '@comp/Renderer/RendererMain';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@comp/Home/HomePage'));
const AboutPage = lazy(() => import('@comp/About/AboutPage'));
const ExperiencePage = lazy(() => import('@comp/Experience/ExperiencePage'));
const ProjectPage = lazy(() => import('@comp/Project/ProjectPage'));
const SkillPage = lazy(() => import('@comp/Skill/SkillPage'));

// Loading component
const PageLoader: React.FC = () => (
    <div className="page-container">
        <div className="glass-panel-dark p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-game-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-game-text-secondary tracking-wider">
                LOADING...
            </p>
        </div>
    </div>
);

const App: React.FC = () => {
    const currentPage = useAppSelector((state) => state.currentPage);

    // Page transition animation
    const transitions = useTransition(currentPage, {
        from: {
            opacity: 0,
            transform: 'scale(0.95) translateY(20px)',
            filter: 'blur(8px)',
        },
        enter: {
            opacity: 1,
            transform: 'scale(1) translateY(0px)',
            filter: 'blur(0px)',
        },
        leave: {
            opacity: 0,
            transform: 'scale(1.02) translateY(-10px)',
            filter: 'blur(8px)',
        },
        config: { ...config.gentle, duration: 350 },
        exitBeforeEnter: true,
    });

    return (
        <div className="relative min-w-screen min-h-screen overflow-hidden bg-game-bg-dark">
            {/* 3D Background */}
            {/* <Background3D timeOfDay="night" /> */}
            <RendererMain />

            {/* Page Content with Transitions */}
            <main className="relative z-10 min-h-screen w-full">
                {transitions((style, item) => (
                    <animated.div
                        style={{
                            ...style,
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <Suspense fallback={<PageLoader />}>
                            {item === 0 && <HomePage />}
                            {item === 1 && <AboutPage />}
                            {item === 2 && <ExperiencePage />}
                            {item === 3 && <ProjectPage />}
                            {item === 4 && <SkillPage />}
                        </Suspense>
                    </animated.div>
                ))}
            </main>

            {/* Global scan line effect */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
                style={{
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
                }}
            />
        </div>
    );
};

export default App;
