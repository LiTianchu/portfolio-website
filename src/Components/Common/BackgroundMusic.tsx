import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'react-feather';

interface BackgroundMusicProps {
    audioSrcPromise: Promise<string>;
}

function BackgroundMusic({ audioSrcPromise }: BackgroundMusicProps) {
    const [resolvedAudioSrc, setResolvedAudioSrc] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        audioSrcPromise
            .then((src) => {
                setResolvedAudioSrc(src);
                console.log('Audio source loaded:', src);
            })
            .catch((error) => {
                console.error('Error loading audio source:', error);
            });
    }, [audioSrcPromise]);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((err) => {
                    console.error('Failed to play audio:', err);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            {resolvedAudioSrc && (
                <>
                    <audio ref={audioRef} loop>
                        <source src={resolvedAudioSrc} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <button
                        onClick={toggleAudio}
                        className="fixed bottom-5 right-5 z-[1000] p-3 rounded-full border-none cursor-pointer bg-game-bg-medium hover:bg-light-ink/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-in-out"
                        aria-label={isPlaying ? 'Mute' : 'Unmute'}
                    >
                        {isPlaying ? (
                            <Volume2
                                size={20}
                                color="rgba(255, 255, 255, 0.8)"
                                strokeWidth={1.5}
                            />
                        ) : (
                            <VolumeX
                                size={20}
                                color="rgba(255, 255, 255, 0.5)"
                                strokeWidth={1.5}
                            />
                        )}
                    </button>
                </>
            )}
        </>
    );
}

export default BackgroundMusic;
