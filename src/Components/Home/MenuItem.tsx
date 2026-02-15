import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import type { Icon } from 'react-feather';
import { ArrowRight } from 'react-feather';

interface MenuItemProps {
    label: string;
    pageIndex: number;
    onClick: (index: number) => void;
    delay: number;
    icon: Icon;
}

function MenuItem({
    label,
    pageIndex,
    onClick,
    delay,
    icon: Icon, // rename icon to Icon
}: MenuItemProps) {
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
                       bg-game-bg-light/50 border rounded-xl
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

            <div className="flex items-center relative z-10">
                <span className="mr-4">
                    <Icon className="text-2xl" size={24} />
                </span>
                <span className="text-xl font-semibold tracking-wider text-game-text-primary group-hover:text-game-primary transition-colors">
                    {label}
                </span>
                <span className="ml-auto text-game-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                </span>
            </div>
        </animated.button>
    );
}

export default MenuItem;
