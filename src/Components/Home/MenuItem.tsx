import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';

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
                    �?{' '}
                </span>
            </div>
        </animated.button>
    );
};

export default MenuItem;
