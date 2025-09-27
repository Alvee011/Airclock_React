/**
 * @file Renders an immersive, full-screen clock display.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { Clock, Settings } from '../types';
import { formatTime, formatDate } from '../utils/time';

interface FullScreenClockProps {
    /** Whether the full-screen view is currently active. */
    isOpen: boolean;
    /** Callback to close the full-screen view. */
    onClose: () => void;
    /** The current time Date object. */
    now: Date;
    /** The clock data to display. */
    mainClock: Clock;
    /** User settings for formatting. */
    settings: Settings;
    /** State object for focus mode, which adds a video background. */
    focusMode: { active: boolean; videoId?: string };
}

/**
 * The FullScreenClock component provides a distraction-free view of the main clock.
 * It can be closed by clicking or pressing the Escape key. It also supports native
 * browser full-screen mode by pressing the 'F' key and can display a background video
 * for "focus mode".
 */
const FullScreenClock: React.FC<FullScreenClockProps> = ({ isOpen, onClose, now, mainClock, settings, focusMode }) => {
    const videoRef = useRef<HTMLIFrameElement>(null);

    // Toggles the browser's native full-screen mode.
    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    // Effect to set up and clean up keyboard event listeners.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'f') {
                toggleFullScreen();
            }
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to remove the event listener when the component unmounts or `isOpen` changes.
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, toggleFullScreen]);

    // Effect to manage the YouTube video background for focus mode.
    useEffect(() => {
        if (isOpen && focusMode.active && focusMode.videoId && videoRef.current) {
            const embedUrl = `https://www.youtube.com/embed/${focusMode.videoId}?autoplay=1&loop=1&playlist=${focusMode.videoId}&controls=0&showinfo=0&modestbranding=1&enablejsapi=1&mute=1`;
            videoRef.current.src = embedUrl;
        } else if (videoRef.current) {
            // Clear the src to stop the video when focus mode is inactive.
            videoRef.current.src = '';
        }
    }, [isOpen, focusMode]);
    
    // Don't render anything if the component is not open.
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col justify-center items-center cursor-pointer" onClick={onClose}>
            {/* Video background for focus mode */}
            {focusMode.active && (
                 <div className="absolute inset-0 w-full h-full overflow-hidden z-[-1] opacity-30">
                    <iframe
                        ref={videoRef}
                        className="absolute top-1/2 left-1/2 w-full h-full min-w-[177.77vh] min-h-[100vh] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        src=""
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            )}
            <p className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold font-mono text-shine">{formatTime(now, mainClock, settings)}</p>
            <p className="mt-4 text-2xl sm:text-3xl md:text-4xl text-white/80">{formatDate(now, mainClock, settings)}</p>
        </div>
    );
};

export default FullScreenClock;
