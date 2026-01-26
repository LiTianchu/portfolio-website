import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useSpring, animated, config } from '@react-spring/web';
import { useState } from 'react';

interface SlideShowProps {
    images: string[];
}

// vite glob import for images
const imageModules = import.meta.glob('@assets/images/*', {
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
            <animated.div style={fadeSpring}>
                {images.map((img, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <img
                            key={index}
                            src={getImageUrl(img)}
                            style={{
                                scale: isActive ? 1 : 0.8,
                            }}
                        />
                    );
                })}
            </animated.div>

            {/* Navigation buttons */}
            <div className="flex absolute justify-center mt-4 gap-4">
                <animated.div
                    style={fadeSpring}
                    className="flex absolute justify-between top-1/2 w-full px-4"
                >
                    <button onClick={prevSlide}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlide}>
                        <ChevronRight size={20} />
                    </button>
                </animated.div>
            </div>
        </div>
    );
};

export default SlideShow;
