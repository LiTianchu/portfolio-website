import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAppSelector } from '@states/hook';

interface NavMenuProps {
    onPageChange: (pageIndex: number) => void;
}

interface NavItemProps {
    label: string;
    icon: string;
    pageIndex: number;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
    label,
    icon,
    isActive,
    onClick,
}) => {
    const [hovered, setHovered] = useState(false);

    const spring = useSpring({
        scale: hovered ? 1.1 : 1,
        y: hovered ? -2 : 0,
        config: { tension: 300, friction: 20 },
    });

    return (
        <animated.button
            style={{
                transform: spring.scale.to(
                    (s) => `scale(${s}) translateY(${spring.y.get()}px)`
                ),
            }}
            className={`relative px-4 py-2 flex flex-col items-center gap-1 transition-colors
                       ${isActive ? 'text-game-primary' : 'text-game-text-muted hover:text-game-text-secondary'}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-semibold tracking-wider hidden md:block">
                {label}
            </span>
            {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-game-primary" />
            )}
        </animated.button>
    );
};

const NavMenu: React.FC<NavMenuProps> = ({ onPageChange }) => {
    const currentPage = useAppSelector((state) => state.currentPage);

    const containerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        delay: 100,
    });

    const navItems = [
        { label: 'HOME', icon: '🏠', pageIndex: 0 },
        { label: 'ABOUT', icon: '👤', pageIndex: 1 },
        { label: 'EXPERIENCE', icon: '💾', pageIndex: 2 },
        { label: 'PROJECTS', icon: '🎮', pageIndex: 3 },
        { label: 'SKILLS', icon: '⚡', pageIndex: 4 },
    ];

    return (
        <animated.nav
            style={containerSpring}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass-panel px-6 py-3"
        >
            <ul className="flex items-center gap-2">
                {navItems.map((item) => (
                    <li key={item.pageIndex}>
                        <NavItem
                            label={item.label}
                            icon={item.icon}
                            pageIndex={item.pageIndex}
                            isActive={currentPage === item.pageIndex}
                            onClick={() => onPageChange(item.pageIndex)}
                        />
                    </li>
                ))}
            </ul>
        </animated.nav>
    );
};

export default NavMenu;
