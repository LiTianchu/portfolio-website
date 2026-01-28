import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useAppDispatch } from '@states/hook';
import { changePage } from '@states/currentPageSlice';
import { Code, Save, Zap, Coffee } from 'react-feather';
import MenuItem from './MenuItem';

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();

    const titleSpring = useSpring({
        from: { opacity: 0, y: -30 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const subtitleSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 300,
        config: config.gentle,
    });

    const handleMenuClick = (pageIndex: number) => {
        dispatch(changePage(pageIndex));
    };

    const menuItems = [
        { label: 'PROJECTS', pageIndex: 3, icon: Code },
        { label: 'EXPERIENCES', pageIndex: 2, icon: Save },
        { label: 'SKILLS', pageIndex: 4, icon: Zap },
        { label: 'ABOUT', pageIndex: 1, icon: Coffee },
    ];

    return (
        <div className="page-container">
            <div className="p-12 max-w-2xl w-full h-64 flex flex-col justify-center">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <animated.h1
                        style={titleSpring}
                        className="text-5xl md:text-6xl font-bold mb-4 tracking-wider whitespace-nowrap"
                    >
                        <span className="text-game-primary glow-text">
                            Tianchu&apos;s
                        </span>
                        <span className="text-game-text-primary">
                            {' '}
                            Portfolio
                        </span>
                    </animated.h1>
                    <animated.p
                        style={subtitleSpring}
                        className="text-game-text-secondary text-lg tracking-widest"
                    >
                        PROGRAMMER • ARTIST • CREATOR
                    </animated.p>
                    <animated.div
                        style={subtitleSpring}
                        className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-game-primary to-transparent"
                    />
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-4 items-center">
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={item.label}
                            label={item.label}
                            pageIndex={item.pageIndex}
                            onClick={handleMenuClick}
                            delay={400 + index * 100}
                            icon={item.icon}
                        />
                    ))}
                </div>

                {/* Footer hint */}
                <animated.p
                    style={subtitleSpring}
                    className="text-center mt-12 text-game-text-muted text-sm tracking-wider animate-pulse-glow"
                >
                    SELECT AN OPTION TO CONTINUE
                </animated.p>
            </div>
        </div>
    );
};

export default HomePage;
