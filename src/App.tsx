import React from 'react';
import { useAppSelector, useAppDispatch } from '@states/hook';
import { changePage } from '@states/currentPageSlice';
import NavMenu from '@comp/Common/NavMenu';
import HomePage from '@comp/Home/HomePage';
import AboutPage from '@comp/About/AboutPage';
import ExperiencePage from '@comp/Experience/ExperiencePage';
import ProjectPage from '@comp/Project/ProjectPage';
import SkillPage from '@comp/Skill/SkillPage';

const App: React.FC = () => {
    const currentPage: number = useAppSelector((state) => state.currentPage);
    const dispatch = useAppDispatch();

    const handleCurrentPageChange = (pageIndex: number) => {
        dispatch(changePage(pageIndex));
    };

    console.log('Current Page Index:', currentPage);

    return (
        <>
            <NavMenu onPageChange={handleCurrentPageChange} />
            {currentPage === 0 && <HomePage />}
            {currentPage === 1 && <AboutPage />}
            {currentPage === 2 && <ExperiencePage />}
            {currentPage === 3 && <ProjectPage />}
            {currentPage === 4 && <SkillPage />}
        </>
    );
};

export default App;
