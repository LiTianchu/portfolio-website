import React from 'react';

export interface ExperienceItemProps {
    title: string;
    occupationType: string;
    organizationName: string;
    startDate: string;
    endDate: string | 'Current';
    location: string;
    descPoints?: string[];
    achievements?: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
    title,
    occupationType,
    organizationName,
    startDate,
    endDate,
    location,
    descPoints,
    achievements,
}) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    return (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                    <div>
                        <p className="text-lg font-semibold text-blue-600">
                            {organizationName}
                        </p>
                        <p className="text-sm text-gray-600">
                            {occupationType} · {location}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                        {formatDate(startDate)} -{' '}
                        {endDate === 'Current'
                            ? 'Present'
                            : formatDate(endDate)}
                    </p>
                </div>
            </div>

            {descPoints && descPoints.length > 0 && (
                <div className="mb-4">
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {descPoints.map((point, index) => (
                            <li key={index} className="leading-relaxed">
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {achievements && achievements.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        Key Achievements:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {achievements.map((achievement, index) => (
                            <li key={index} className="leading-relaxed">
                                {achievement}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ExperienceItem;
