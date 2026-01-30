import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAppDispatch } from '@states/hook';
import { changePage } from '@states/currentPageSlice';
import { ArrowLeft } from 'react-feather';
interface BackButtonProps {
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
    const dispatch = useAppDispatch();
    const [hovered, setHovered] = React.useState(false);

    const spring = useSpring({
        scale: hovered ? 1.05 : 1,
        x: hovered ? -4 : 0,
        config: { tension: 300, friction: 18 },
    });

    return (
        <animated.button
            style={{
                transform: spring.scale.to(
                    (s) => `scale(${s}) translateX(${spring.x.get()}px)`
                ),
            }}
            className={`game-button hover:game-button-hover rounded-lg px-4 py-2 text-sm text-center ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => dispatch(changePage(0))}
        >
            <span className="inline-block align-middle">
                <ArrowLeft />
            </span>{' '}
        </animated.button>
    );
};

export default BackButton;
