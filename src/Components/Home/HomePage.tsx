import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useAppDispatch } from '@states/hook';
import { changePage } from '@states/currentPageSlice';

interface MenuItemProps {
    label: string;
    pageIndex: number;
    onClick: (index: number) => void;
    delay: number;
    icon: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
    label,
    pageIndex,
    onClick,
    delay,
    icon,
}) => {
    const [hovered, setHovered] = React.useState(false);

    const springProps = useSpring({
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0 },
        delay: delay,
        config: config.gentle,
    });

    const hoverSpring = useSpring({
        scale: hovered ? 1.05 : 1,
        x: hovered ? 10 : 0,
        glowOpacity: hovered ? 1 : 0,
        config: { tension: 300, friction: 20 },
    });

    return (
        <animated.button
            style={{
                ...springProps,
                transform: hoverSpring.scale.to(
                    (s) => `scale(${s}) translateX(${hoverSpring.x.get()}px)`
                ),
            }}
            className="relative w-full max-w-md py-4 px-8 text-left cursor-pointer
                       glass-panel border-2 border-transparent
                       hover:border-game-primary transition-colors duration-300
                       group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(pageIndex)}
        >
            {/* Glow effect */}
            <animated.div
                style={{ opacity: hoverSpring.glowOpacity }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-game-primary/20 to-transparent pointer-events-none"
            />

            <div className="flex items-center gap-4 relative z-10">
                <span className="text-2xl">{icon}</span>
                <span className="text-xl font-semibold tracking-wider text-game-text-primary group-hover:text-game-primary transition-colors">
                    {label}
                </span>
                <span className="ml-auto text-game-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    ▶
                </span>
            </div>
        </animated.button>
    );
};

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
        { label: 'PROJECTS', pageIndex: 3, icon: '🎮' },
        { label: 'EXPERIENCE', pageIndex: 2, icon: '💾' },
        { label: 'SKILLS', pageIndex: 4, icon: '⚡' },
        { label: 'ABOUT', pageIndex: 1, icon: '👤' },
    ];

    return (
        <div className="page-container">
            <div className="glass-panel-dark p-12 max-w-2xl w-full">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <animated.h1
                        style={titleSpring}
                        className="text-5xl md:text-6xl font-bold mb-4 tracking-wider"
                    >
                        <span className="text-game-primary glow-text">
                            PLAYER
                        </span>
                        <span className="text-game-text-primary"> ONE</span>
                    </animated.h1>
                    <animated.p
                        style={subtitleSpring}
                        className="text-game-text-secondary text-lg tracking-widest"
                    >
                        PORTFOLIO • DEVELOPER • CREATOR
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
