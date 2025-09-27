
import React, { useEffect, useRef } from 'react';
import { Clock, Settings } from '../types';
import { formatTime, formatDate } from '../utils/time';

interface FullScreenClockProps {
    isOpen: boolean;
    onClose: () => void;
    now: Date;
    mainClock: Clock;
    settings: Settings;
    focusMode: { active: boolean; videoId?: string };
}

const FullScreenClock: React.FC<FullScreenClockProps> = ({ isOpen, onClose, now, mainClock, settings, focusMode }) => {
    const videoRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (isOpen && focusMode.active && focusMode.videoId && videoRef.current) {
            const embedUrl = `https://www.youtube.com/embed/${focusMode.videoId}?autoplay=1&loop=1&playlist=${focusMode.videoId}&controls=0&showinfo=0&modestbranding=1&enablejsapi=1&mute=1`;
            videoRef.current.src = embedUrl;
        } else if (videoRef.current) {
            videoRef.current.src = '';
        }
    }, [isOpen, focusMode]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col justify-center items-center cursor-pointer" onClick={onClose}>
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
            <p className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold font-mono text-white">{formatTime(now, mainClock, settings)}</p>
            <p className="mt-4 text-2xl sm:text-3xl md:text-4xl text-white/80">{formatDate(now, mainClock, settings)}</p>
        </div>
    );
};

export default FullScreenClock;
