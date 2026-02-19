import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
const controlPanelSettings = [
    'Atmosphere',
    'Sky',
    'Water',
    'Post-processing',
    'Shadows',
    'Visualization',
];

function RendererControlPanel() {
    const [currentSetting, setCurrentSetting] = useState(0);

    const handlePrevious = () => {
        setCurrentSetting((prev) => {
            return prev === 0 ? controlPanelSettings.length - 1 : prev - 1;
        });
    };

    const handleNext = () => {
        setCurrentSetting((prev) => {
            return prev === controlPanelSettings.length - 1 ? 0 : prev + 1;
        });
    };
    return (
        <div className="absolute flex flex-col justify-start bottom-0 left-0 right-0 h-1/4 max-h-80 text-center bg-gradient-to-t from-game-bg-dark to-transparent z-50">
            <div className="flex items-center justify-between gap-4 mb-4">
                <button onClick={handlePrevious}>
                    <ArrowLeft size={36} />
                </button>
                <h3 className="text-3xl font-bold">
                    {controlPanelSettings[currentSetting]}
                </h3>
                <button onClick={handleNext}>
                    <ArrowRight size={36} />
                </button>
            </div>

            {currentSetting === 0 && (
                <div className="text-lg">Atmosphere Settings</div>
            )}
            {currentSetting === 1 && (
                <div className="text-lg">Sky Settings</div>
            )}
        </div>
    );
}

export default RendererControlPanel;
