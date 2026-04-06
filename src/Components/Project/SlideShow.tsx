import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useTransition, animated, config } from '@react-spring/web';

interface SlideShowProps {
    images: string[];
    imagesFit?: 'cover' | 'contain';
}

function SlideShow({ images, imagesFit = 'cover' }: SlideShowProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    // Fade transition for slide changes
    const transitions = useTransition(currentIndex, {
        from: {
            opacity: 0,
            transform:
                direction === 'next'
                    ? 'translateX(30px) scale(0.98)'
                    : 'translateX(-30px) scale(0.98)',
        },
        enter: {
            opacity: 1,
            transform: 'translateX(0px) scale(1)',
        },
        leave: {
            opacity: 0,
            transform:
                direction === 'next'
                    ? 'translateX(-30px) scale(0.98)'
                    : 'translateX(30px) scale(0.98)',
        },
        config: { ...config.gentle, duration: 300 },
        exitBeforeEnter: true,
    });

    // Preload adjacent images for smooth transitions
    useEffect(() => {
        const preloadIndexes = [
            currentIndex,
            (currentIndex + 1) % images.length,
            (currentIndex - 1 + images.length) % images.length,
        ];

        preloadIndexes.forEach((index) => {
            if (!loadedImages.has(index) && !imageErrors.has(index)) {
                const img = new Image();
                img.src = images[index];
                img.onload = () => {
                    setLoadedImages((prev) => new Set(prev).add(index));
                };
                img.onerror = () => {
                    setImageErrors((prev) => new Set(prev).add(index));
                };
            }
        });
    }, [currentIndex, images, loadedImages, imageErrors]);

    const nextSlide = () => {
        setDirection('next');
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setDirection('prev');
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div>
            {/* Slides container */}
            <div className="flex justify-center flex-col relative w-full 4xl:h-180 3xl:h-150 lg:h-120 sm:h-80 md:h-100 h-50 overflow-hidden">
                {transitions((style, index) => {
                    const img = images[index];
                    const isLoaded = loadedImages.has(index);
                    const hasError = imageErrors.has(index);

                    return (
                        <animated.div
                            style={style}
                            className="absolute inset-0 w-full h-full"
                        >
                            {!img || hasError ? (
                                <div className="flex items-center justify-center w-full h-full bg-game-bg-dark text-game-text-muted">
                                    <span className="text-sm">
                                        Image failed to load
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {!isLoaded && (
                                        <div className="absolute inset-0 bg-game-bg-dark animate-pulse" />
                                    )}
                                    <img
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className={`fade-lr-edge w-full h-full transition-opacity duration-300 ${
                                            imagesFit === 'contain'
                                                ? 'object-contain'
                                                : 'object-cover'
                                        } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                </>
                            )}
                        </animated.div>
                    );
                })}

                {/* Navigation buttons */}
                <div className="flex flex-col absolute m-auto top-1/2 transform -translate-y-1/2 left-0 justify-center w-full h-10">
                    <div className="flex absolute justify-between top-0 w-full px-0 h-full">
                        <button
                            onClick={prevSlide}
                            className="filter drop-shadow-lg text-game-primary cursor-pointer hover:text-light-ink hover:scale-110 transition-all"
                            style={{
                                filter: 'drop-shadow(2px 5px 2px rgba(48,48,48,0.6))',
                            }}
                        >
                            <ChevronLeft size={48} strokeWidth={3} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="filter drop-shadow-lg text-game-primary cursor-pointer hover:text-light-ink hover:scale-110 transition-all"
                            style={{
                                filter: 'drop-shadow(2px 5px 2px rgba(48,48,48,0.6))',
                            }}
                        >
                            <ChevronRight size={48} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(
                                index > currentIndex ? 'next' : 'prev'
                            );
                            setCurrentIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer${
                            index === currentIndex
                                ? 'bg-game-primary w-6'
                                : 'bg-game-text-muted hover:bg-game-primary'
                        } `}
                    />
                ))}
            </div>
        </div>
    );
}

export default SlideShow;
