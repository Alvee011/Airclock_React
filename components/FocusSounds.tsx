/**
 * @file Renders a set of buttons for playing ambient sounds or entering focus mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sound } from '../types';

// A predefined list of available sounds.
const SOUNDS: Sound[] = [
    { name: 'Rain', videoId: 'q76bMs-NwRk', icon: '🌧️' },
    { name: 'Forest', videoId: 'xNN7iTA57jM', icon: '🌲' },
    { name: 'Owl', videoId: 'BqAzRJmivqw', icon: '🦉' },
    { name: 'Focus', videoId: 'WPni755-Krg', icon: '🧘' },
];

interface FocusSoundsProps {
    /** Callback to notify the parent component about changes in focus mode state. */
    onFocusModeToggle: (active: boolean, videoId?: string) => void;
}

/**
 * The FocusSounds component provides a set of buttons to play different ambient sounds
 * or a "focus" sound. It uses a hidden YouTube iframe to play the audio. Activating the
 * "Focus" sound also triggers the full-screen clock's focus mode.
 */
const FocusSounds: React.FC<FocusSoundsProps> = ({ onFocusModeToggle }) => {
    // State to keep track of the currently playing sound.
    const [playingSound, setPlayingSound] = useState<Sound | null>(null);
    // Ref to the hidden iframe element used as the audio player.
    const playerRef = useRef<HTMLIFrameElement>(null);

    // Effect to control the YouTube player's source based on the `playingSound` state.
    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        if (playingSound) {
            const isFocusSound = playingSound.name === 'Focus';
            // Notify the parent component (TimePage) that focus mode has been activated/deactivated.
            onFocusModeToggle(isFocusSound, playingSound.videoId);
            
            if (isFocusSound) {
                // If focus mode starts, we stop the ambient sound player. The video background
                // is handled by the FullScreenClock component itself.
                player.src = ''; 
            } else {
                // For regular ambient sounds, load and play the video in the hidden iframe.
                player.src = `https://www.youtube.com/embed/${playingSound.videoId}?autoplay=1&loop=1&playlist=${playingSound.videoId}&controls=0&enablejsapi=1`;
            }
        } else {
            // If no sound is selected, stop everything.
            onFocusModeToggle(false);
            player.src = '';
        }
    }, [playingSound, onFocusModeToggle]);

    // Handles clicks on the sound buttons. Toggles the sound on and off.
    const handleSoundClick = (sound: Sound) => {
        setPlayingSound(current => (current?.videoId === sound.videoId ? null : sound));
    };

    return (
        <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            {SOUNDS.map(sound => (
                <button 
                    key={sound.name}
                    onClick={() => handleSoundClick(sound)}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                        playingSound?.videoId === sound.videoId 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-accent-light dark:hover:border-accent-dark'
                    }`}
                >
                    <span className="text-2xl">{sound.icon}</span>
                    <span className="text-xs font-medium">{sound.name}</span>
                </button>
            ))}
            {/* A hidden container for the YouTube iframe player. */}
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
