import React from 'react';
import { useState, useEffect } from 'react';
import ExperienceItem from './ExperienceItem';
import type { ExperienceItemProps } from './ExperienceItem';
import experiencesJSON from '@assets/experiences.json';

const ExperiencePage: React.FC = () => {
    const [experienceItems, setExperienceItems] = useState<
        ExperienceItemProps[]
    >([]);

    const loadExperienceItems = () => {
        const experiences = experiencesJSON as {
            experiences: ExperienceItemProps[];
        };
        setExperienceItems(experiences.experiences || []);
    };

    useEffect(() => {
        loadExperienceItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Professional Experience
                    </h1>
                    <p className="text-lg text-gray-600">
                        My journey through various roles and organizations
                    </p>
                </div>
                <div className="space-y-6">
                    {experienceItems.length > 0 ? (
                        experienceItems.map((exp, index) => (
                            <ExperienceItem
                                key={`${exp.title}-${index}`}
                                {...exp}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No experiences to display yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperiencePage;
