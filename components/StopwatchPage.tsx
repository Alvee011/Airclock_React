/**
 * @file Implements the Stopwatch page component.
 */

import React, { useState, useRef, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

/**
 * Formats a time in milliseconds into hours, minutes, seconds, and hundredths of a second.
 * @param {number} time - The time in milliseconds.
 * @returns An object with formatted time components.
 */
const formatTime = (time: number) => {
    const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
    const s = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const m = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
    const h = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
    return { h, m, s, ms };
};

/**
 * The StopwatchPage component provides a standard stopwatch functionality,
 * including start, stop, lap, and reset features.
 */
const StopwatchPage: React.FC = () => {
    // State to hold the elapsed time in milliseconds.
    const [time, setTime] = useState(0);
    // State to track whether the stopwatch is running or paused.
    const [isRunning, setIsRunning] = useState(false);
    // State to store a list of lap times.
    const [laps, setLaps] = useState<number[]>([]);

    // useInterval hook to update the time every 10 milliseconds when isRunning is true.
    useInterval(
        () => {
            setTime(prevTime => prevTime + 10);
        },
        isRunning ? 10 : null // The interval is paused if `isRunning` is false.
    );

    // Toggles the running state of the stopwatch.
    const handleToggle = useCallback(() => {
        setIsRunning(prev => !prev);
    }, []);

    // Resets the stopwatch to its initial state.
    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    }, []);

    // Records the current time as a lap.
    const handleLap = useCallback(() => {
        if (isRunning) {
            setLaps(prev => [...prev, time]);
        }
    }, [isRunning, time]);

    const { h, m, s, ms } = formatTime(time);
    
    return (
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-card-dark rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Stopwatch</h2>
            <div className="text-center font-mono text-5xl sm:text-7xl font-bold tracking-tighter">
                {h}:{m}:{s}
                <span className="text-3xl sm:text-5xl text-accent-light dark:text-accent-dark">.{ms}</span>
            </div>
            <div className="flex justify-center gap-4 my-8">
                <button 
                    onClick={handleToggle} 
                    className={`px-8 py-3 w-32 font-semibold rounded-full text-white transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                 <button onClick={handleLap} disabled={!isRunning} className="px-8 py-3 w-32 font-semibold rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Lap</button>
                 <button onClick={handleReset} className="px-8 py-3 w-32 font-semibold rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors">Reset</button>
            </div>
            {laps.length > 0 && (
                <ul className="max-h-80 overflow-y-auto space-y-2 pr-2">
                    {/* Display laps in reverse order (newest first) */}
                    {laps.slice().reverse().map((lap, index) => {
                        const { h, m, s, ms } = formatTime(lap);
                        // Calculate the time difference from the previous lap.
                        const prevLap = index === laps.length -1 ? 0 : laps[laps.length - index -2]
                        const diff = formatTime(lap - prevLap);
                        return (
                            <li key={index} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg font-mono">
                                <span className="font-semibold">Lap {laps.length - index}</span>
                                <span className="text-sm opacity-70">+{diff.h}:{diff.m}:{diff.s}.{diff.ms}</span>
                                <span>{h}:{m}:{s}.{ms}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default StopwatchPage;
