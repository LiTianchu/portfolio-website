import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'react-feather';
import { useTransition, useSpring, animated, config } from '@react-spring/web';
import type { ImageSrcSet } from './ProjectPage';

interface SlideShowProps {
    images: ImageSrcSet[];
    imagesFit?: 'cover' | 'contain';
}

function SlideShow({ images, imagesFit = 'cover' }: SlideShowProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [lightboxOpen, setLightboxOpen] = useState(false);

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

    // Lightbox spring animation
    const lightboxStyle = useSpring({
        opacity: lightboxOpen ? 1 : 0,
        transform: lightboxOpen ? 'scale(1)' : 'scale(0.92)',
        config: { ...config.gentle, duration: 250 },
    });

    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    // Close lightbox on Escape key
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen, closeLightbox]);

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
                img.src = images[index].desktop;
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
                    const imgSet = images[index];
                    const isLoaded = loadedImages.has(index);
                    const hasError = imageErrors.has(index);

                    return (
                        <animated.div
                            style={style}
                            className="absolute inset-0 w-full h-full"
                        >
                            {!imgSet || hasError ? (
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
                                    <picture style={{ display: 'contents' }}>
                                        {imgSet.mobile && (
                                            <source
                                                media="(max-width: 768px)"
                                                srcSet={imgSet.mobile}
                                            />
                                        )}
                                        {imgSet.tablet && (
                                            <source
                                                media="(max-width: 1280px)"
                                                srcSet={imgSet.tablet}
                                            />
                                        )}
                                        <img
                                            src={imgSet.desktop}
                                            alt={`Slide ${index + 1}`}
                                            loading={
                                                index === 0 ? 'eager' : 'lazy'
                                            }
                                            decoding="async"
                                            onLoad={() =>
                                                setLoadedImages((prev) =>
                                                    new Set(prev).add(index)
                                                )
                                            }
                                            onError={() =>
                                                setImageErrors((prev) =>
                                                    new Set(prev).add(index)
                                                )
                                            }
                                            className={`fade-lr-edge w-full h-full transition-opacity duration-300 ${
                                                imagesFit === 'contain'
                                                    ? 'object-contain'
                                                    : 'object-cover'
                                            } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </picture>
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

            <div className="relative flex justify-center items-center mt-4">
                {/* Slide indicators */}
                <div className="flex justify-center gap-2">
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
                                    ? ' bg-game-primary w-6'
                                    : ' bg-game-text-muted hover:bg-game-primary'
                            } `}
                        />
                    ))}
                </div>
                {/* Expand button — mobile only */}
                <button
                    onClick={openLightbox}
                    aria-label="View full size"
                    className="md:hidden absolute my-auto right-2 bg-game-primary/75 text-dark-ink rounded-full p-1.5 hover:bg-game-primary/90 transition-colors cursor-pointer z-10"
                >
                    <Maximize2 size={16} />
                </button>
            </div>

            {/* Lightbox overlay — mobile expand */}
            {lightboxOpen && (
                <animated.div
                    style={{ opacity: lightboxStyle.opacity }}
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button anchored to the overlay corner */}
                    <button
                        onClick={closeLightbox}
                        aria-label="Close"
                        className="absolute top-3 right-3 bg-game-primary/60 text-dark-ink rounded-full p-1.5 hover:bg-game-primary/90 transition-colors cursor-pointer z-10"
                    >
                        <X size={16} />
                    </button>
                    <animated.div
                        style={{ transform: lightboxStyle.transform }}
                        className="flex items-center justify-center w-full h-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentIndex]?.desktop}
                            alt={`Slide ${currentIndex + 1} full size`}
                            className="max-w-full max-h-full w-auto h-auto object-contain rounded"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </animated.div>
                </animated.div>
            )}
        </div>
    );
}

export default SlideShow;
