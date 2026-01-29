import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useSpring, animated, config } from '@react-spring/web';
import { useState } from 'react';

interface SlideShowProps {
    images: string[];
}

// vite glob import for images
const imageModules = import.meta.glob('@assets/images/**/*', {
    eager: true,
    as: 'url',
});

const SlideShow: React.FC<SlideShowProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const fadeSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: config.gentle,
    });

    const getImageUrl = (filename: string) => {
        const path = `/src/assets/images/${filename}`;
        return imageModules[path] as string;
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div>
            {/* Slides container */}
            <animated.div
                style={fadeSpring}
                className="flex justify-center flex-col relative w-full h-100 overflow-hidden"
            >
                {images.map((img, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <img
                            key={index}
                            src={getImageUrl(img)}
                            style={{
                                display: isActive ? 'block' : 'none',
                            }}
                            className="fade-lr-edge absolute inset-0 w-full h-full object-cover"
                        />
                    );
                })}

                {/* Navigation buttons */}
                <div className="flex flex-col absolute m-auto top-1/2 transform -translate-y-1/2 left-0 justify-center w-full h-10">
                    <animated.div
                        style={fadeSpring}
                        className="flex absolute justify-between top-0 w-full px-4 h-full"
                    >
                        <button
                            onClick={prevSlide}
                            className="filter drop-shadow-lg text-game-text-primary"
                            style={{
                                textShadow: '2px 5px 2px rgba(0,0,0,0.8)',
                            }}
                        >
                            <ChevronLeft
                                size={30}
                                strokeWidth={3}
                                style={{
                                    textShadow: ` 1px 2px 0 rgba(0,0,0,0.9), 2px 4px 0 rgba(0,0,0,0.6) `,
                                }}
                            />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="filter drop-shadow-lg text-game-text-primary "
                            style={{
                                textShadow: '2px 5px 2px rgba(0,0,0,0.8)',
                            }}
                        >
                            <ChevronRight
                                size={30}
                                strokeWidth={3}
                                style={{
                                    textShadow: ` 1px 2px 0 rgba(0,0,0,0.9), 2px 4px 0 rgba(0,0,0,0.6) `,
                                }}
                            />
                        </button>
                    </animated.div>
                </div>
            </animated.div>
        </div>
    );
};

export default SlideShow;
