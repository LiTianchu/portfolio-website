import React from 'react';

interface NavMenuProps {
    onPageChange: (pageIndex: number) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ onPageChange }) => {
    return (
        <>
            <nav>
                <ul>
                    <li onClick={() => onPageChange(0)}>Home</li>
                    <li onClick={() => onPageChange(1)}>About</li>
                    <li onClick={() => onPageChange(2)}>Experience</li>
                    <li onClick={() => onPageChange(3)}>Projects</li>
                    <li onClick={() => onPageChange(4)}>Skills</li>
                </ul>
            </nav>
        </>
    );
};

export default NavMenu;
