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
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 1000,
                            padding: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                        aria-label={isPlaying ? 'Mute' : 'Unmute'}
                    >
                        {isPlaying ? (
                            <Volume2 size={20} color="rgba(255, 255, 255, 0.8)" strokeWidth={1.5} />
                        ) : (
                            <VolumeX size={20} color="rgba(255, 255, 255, 0.5)" strokeWidth={1.5} />
                        )}
                    </button>
                </>
            )}
        </>
    );
}

export default BackgroundMusic;
