import React from 'react';
import { useTransition, animated, config } from '@react-spring/web';

interface PageTransitionProps {
    children: React.ReactNode;
    pageKey: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    pageKey,
}) => {
    const transitions = useTransition(pageKey, {
        from: {
            opacity: 0,
            transform: 'scale(0.95) translateY(20px)',
            filter: 'blur(10px)',
        },
        enter: {
            opacity: 1,
            transform: 'scale(1) translateY(0px)',
            filter: 'blur(0px)',
        },
        leave: {
            opacity: 0,
            transform: 'scale(1.05) translateY(-20px)',
            filter: 'blur(10px)',
        },
        config: { ...config.gentle, duration: 400 },
        exitBeforeEnter: true,
    });

    return (
        <>
            {transitions((style, item) =>
                item === pageKey ? (
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
                        {children}
                    </animated.div>
                ) : null
            )}
        </>
    );
};

export default PageTransition;
