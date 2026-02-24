import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAppDispatch } from '@states/hook';
import { changePage } from '@/states/slices/currentPageSlice';
import { ArrowLeft } from 'react-feather';
interface BackButtonProps {
    className?: string;
    variant?: 'floating' | 'fixed';
}

function BackButton({ className = '', variant = 'floating' }: BackButtonProps) {
    const dispatch = useAppDispatch();
    const [hovered, setHovered] = React.useState<boolean>(false);

    const spring = useSpring({
        scale: hovered ? 1.1 : 1,
        x: hovered ? -3 : 0,
        config: { tension: 300, friction: 18 },
    });

    const positionClasses =
        variant === 'fixed'
            ? 'fixed z-[15] top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8'
            : 'sticky z-[15] top-0 left-0 sm:top-4 sm:left-4';

    return (
        <animated.button
            style={{
                transform: spring.scale.to(
                    (s) => `scale(${s}) translateX(${spring.x.get()}px)`
                ),
            }}
            className={`
                ${positionClasses}
                w-10 h-10
                sm:w-12 sm:h-12
                flex items-center justify-center
                rounded-full
                bg-game-bg-medium/80
                border border-game-primary/30
                text-game-primary backdrop-blur-sm
                shadow-lg shadow-black/30
                hover:bg-game-bg-light/90
                hover:border-game-primary/50
                hover:shadow-[0_0_20px_rgba(168,212,240,0.3)]
                transition-colors duration-300
                cursor-pointer
                ${className}
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => dispatch(changePage(0))}
            aria-label="Go back to home"
        >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </animated.button>
    );
}

export default BackButton;
