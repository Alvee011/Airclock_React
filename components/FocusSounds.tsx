import React, { useState, useEffect, useRef } from 'react';
import { Sound } from '../types';

const SOUNDS: Sound[] = [
    { name: 'Rain', videoId: 'q76bMs-NwRk', icon: '🌧️' },
    { name: 'Forest', videoId: 'xNN7iTA57jM', icon: '🌲' },
    { name: 'Owl', videoId: 'BqAzRJmivqw', icon: '🦉' },
    { name: 'Focus', videoId: 'WPni755-Krg', icon: '🧘' },
];

interface FocusSoundsProps {
    onFocusModeToggle: (active: boolean, videoId?: string) => void;
}

const FocusSounds: React.FC<FocusSoundsProps> = ({ onFocusModeToggle }) => {
    const [playingSound, setPlayingSound] = useState<Sound | null>(null);
    const playerRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        if (playingSound) {
            const isFocusSound = playingSound.name === 'Focus';
            onFocusModeToggle(isFocusSound, playingSound.videoId);
            
            if (isFocusSound) {
                player.src = ''; // Stop ambient sound if focus mode starts
            } else {
                player.src = `https://www.youtube.com/embed/${playingSound.videoId}?autoplay=1&loop=1&playlist=${playingSound.videoId}&controls=0&enablejsapi=1`;
            }
        } else {
            onFocusModeToggle(false);
            player.src = '';
        }
    }, [playingSound, onFocusModeToggle]);

    const handleSoundClick = (sound: Sound) => {
        setPlayingSound(current => (current?.videoId === sound.videoId ? null : sound));
    };

    return (
        <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            {SOUNDS.map(sound => (
                <button 
                    key={sound.name}
                    onClick={() => handleSoundClick(sound)}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 border-2 transition-all ${playingSound?.videoId === sound.videoId ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-accent-light dark:hover:border-accent-dark'}`}
                >
                    <span className="text-2xl">{sound.icon}</span>
                    <span className="text-xs font-medium">{sound.name}</span>
                </button>
            ))}
            <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}>
                <iframe
                    ref={playerRef}
                    title="youtube-player"
                    src=""
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        </div>
    );
};

export default FocusSounds;