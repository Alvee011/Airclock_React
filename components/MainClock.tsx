
import React from 'react';
import { Clock, Settings } from '../types';
import { formatTime, formatDate } from '../utils/time';

interface MainClockProps {
    now: Date;
    mainClock: Clock;
    settings: Settings;
    onFullscreen: () => void;
    children: React.ReactNode;
}

const MainClock: React.FC<MainClockProps> = ({ now, mainClock, settings, onFullscreen, children }) => {
    return (
        <div 
            className="p-8 rounded-2xl bg-white dark:bg-card-dark shadow-lg dark:shadow-2xl text-center transition-transform duration-300 hover:-translate-y-1"
        >
            <div onClick={onFullscreen} className="cursor-pointer">
                <p className="text-5xl sm:text-7xl md:text-8xl font-bold font-mono tracking-tighter">{formatTime(now, mainClock, settings)}</p>
                <p className="mt-2 text-lg sm:text-xl opacity-70">{formatDate(now, mainClock, settings)}</p>
                <p className="mt-1 text-sm opacity-50">{mainClock.timezone.replace(/_/g, ' ')}</p>
            </div>
            {children}
        </div>
    );
};

export default MainClock;
