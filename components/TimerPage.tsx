/**
 * @file Implements the Timer page component.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

/**
 * A reusable input component for setting hours, minutes, or seconds for the timer.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input (e.g., "Hours").
 * @param {number} props.value - The current value of the input.
 * @param {(val: number) => void} props.setValue - The function to call when the value changes.
 * @param {number} props.max - The maximum allowed value for the input.
 */
const TimerInput: React.FC<{label: string, value: number, setValue: (val: number) => void, max: number}> = ({label, value, setValue, max}) => (
    <div className="flex flex-col items-center">
        <label className="text-sm mb-1 opacity-70">{label}</label>
        <input 
            type="number" 
            value={value}
            onChange={e => setValue(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))}
            className="w-20 p-2 text-2xl text-center bg-gray-100 dark:bg-neutral-800 rounded-lg border border-transparent focus:border-accent-light dark:focus:border-accent-dark outline-none"
        />
    </div>
);

/**
 * The TimerPage component allows users to set a countdown timer.
 */
const TimerPage: React.FC = () => {
    // State for the user-defined timer duration.
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(10);
    const [seconds, setSeconds] = useState(0);

    // State for the remaining time in seconds during the countdown.
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    // State to track if the timer is currently running.
    const [isActive, setIsActive] = useState(false);
    
    // Effect to update the total remaining seconds whenever the user changes the timer inputs,
    // but only when the timer is not active.
    useEffect(() => {
        if (!isActive) {
            setRemainingSeconds(hours * 3600 + minutes * 60 + seconds);
        }
    }, [hours, minutes, seconds, isActive]);

    // useInterval hook to decrement the remaining time every second when the timer is active.
    useInterval(() => {
        if (remainingSeconds > 0) {
            setRemainingSeconds(s => s - 1);
        } else {
            setIsActive(false);
            // Alert the user when the timer finishes.
            // A sound could be played here as well.
            alert("Timer finished!");
        }
    }, isActive ? 1000 : null);
    
    // Toggles the timer between running and paused states.
    const handleToggle = useCallback(() => {
        if(remainingSeconds > 0) {
            setIsActive(prev => !prev);
        }
    }, [remainingSeconds]);
    
    // Resets the timer to the currently set duration.
    const handleReset = useCallback(() => {
        setIsActive(false);
        setRemainingSeconds(hours * 3600 + minutes * 60 + seconds);
    }, [hours, minutes, seconds]);

    // Formats the total seconds into a HH:MM:SS string for display.
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-card-dark rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Timer</h2>
            <div className="text-center font-mono text-7xl font-bold tracking-tighter mb-8">
                {formatTime(remainingSeconds)}
            </div>
            {/* The time inputs are only shown when the timer is not active. */}
            {!isActive && (
                <div className="flex justify-center gap-4 mb-8">
                    <TimerInput label="Hours" value={hours} setValue={setHours} max={99} />
                    <TimerInput label="Minutes" value={minutes} setValue={setMinutes} max={59} />
                    <TimerInput label="Seconds" value={seconds} setValue={setSeconds} max={59} />
                </div>
            )}
            <div className="flex justify-center gap-4">
                 <button 
                    onClick={handleToggle} 
                    className={`px-8 py-3 w-32 font-semibold rounded-full text-white transition-colors ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                 <button onClick={handleReset} className="px-8 py-3 w-32 font-semibold rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors">Reset</button>
            </div>
        </div>
    );
};

export default TimerPage;
