/**
 * @file Renders the primary, large clock display on the main page.
 */

import React from 'react';
import { Clock, Settings } from '../types';
import { formatTime, formatDate } from '../utils/time';

interface MainClockProps {
    /** The current time Date object, updated every second. */
    now: Date;
    /** The clock data for the main timezone. */
    mainClock: Clock;
    /** User settings for formatting. */
    settings: Settings;
    /** Callback to trigger the full-screen clock view. */
    onFullscreen: () => void;
    /** Children elements, typically the FocusSounds component. */
    children: React.ReactNode;
}

/**
 * The MainClock component displays the time and date for the user's primary timezone in a large, prominent format.
 * Clicking on it activates the full-screen view. It also serves as a container for child components like FocusSounds.
 */
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
            {/* Renders child components passed to it, like the FocusSounds buttons */}
            {children}
        </div>
    );
};

export default MainClock;
