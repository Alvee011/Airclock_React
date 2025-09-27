/**
 * @file Renders a card for a single pinned world clock.
 */

import React, { useMemo } from 'react';
import { Clock, Settings } from '../types';
import { formatTime, formatDate, getHourInTimezone } from '../utils/time';

interface ClockCardProps {
    /** The current time Date object. */
    now: Date;
    /** The clock data for this specific card. */
    clock: Clock;
    /** The main clock data, used for calculating time differences. */
    mainClock: Clock | null;
    /** Callback to remove this clock from the pinned list. */
    removeClock: (tz: string) => void;
    /** User settings for formatting. */
    settings: Settings;
    /** The translation object. */
    t: any;
}

/**
 * The ClockCard component displays the time, date, and other information for a single timezone
 * that the user has pinned. It shows a day/night icon and calculates the time difference
 * relative to the user's main clock.
 */
const ClockCard: React.FC<ClockCardProps> = ({now, clock, mainClock, removeClock, settings, t}) => {
    // Determine the local hour in the clock's timezone to decide if it's day or night.
    const hour = getHourInTimezone(now, clock.timezone);
    const isDay = hour >= 6 && hour < 18;

    // Memoized calculation for the time difference string.
    // This avoids recalculating on every render unless the clock or mainClock data changes.
    const timeDifference = useMemo(() => {
        // Handle cases where the API call for this clock failed.
        if (clock.apiFailed) {
            return 'Could not fetch time. Please refresh.';
        }
        
        // If data is missing for calculation, show a simpler display.
        if (!mainClock || typeof clock.raw_offset !== 'number' || typeof mainClock.raw_offset !== 'number' || !clock.utc_offset) {
            return `${clock.abbreviation || ''} ${clock.utc_offset || clock.timezone}`;
        }

        // Calculate the difference in hours, accounting for DST.
        const mainOffset = mainClock.raw_offset + mainClock.dst_offset;
        const clockOffset = clock.raw_offset + clock.dst_offset;
        const diffSeconds = clockOffset - mainOffset;
        const diffHours = diffSeconds / 3600;

        let diffText = '';
        if (Math.abs(diffHours) < 0.01) {
            diffText = t.time.same;
        } else {
            const absHours = Math.abs(diffHours);
            // Nicely format fractional hours like .5, .25, .75
            const hoursDisplay = absHours.toString().replace('.5', '½').replace('.25', '¼').replace('.75', '¾');
            const hourWord = absHours === 1 ? t.time.hour : t.time.hours;
            diffText = `${hoursDisplay} ${hourWord} ${diffHours > 0 ? t.time.ahead : t.time.behind}`;
        }

        return `${clock.abbreviation} ${clock.utc_offset} | ${diffText} from ${mainClock.name}`;
    }, [clock, mainClock, t]);
    
    return (
        <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDay ? 'bg-white text-gray-800' : 'bg-card-dark text-gray-100'}`}>
            <button onClick={() => removeClock(clock.timezone)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">✕</button>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xl font-bold">{clock.name || clock.timezone} {clock.flag}</p>
                </div>
                <span className="text-2xl">{isDay ? '☀️' : '🌙'}</span>
            </div>
            <p className="text-4xl font-mono font-bold my-3">{formatTime(now, clock, settings)}</p>
            <p className="text-sm opacity-80">{formatDate(now, clock, settings, 'short')}</p>
            <p className="text-xs mt-2 opacity-60 font-medium bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full inline-block">{timeDifference}</p>
        </div>
    );
};

export default ClockCard;
