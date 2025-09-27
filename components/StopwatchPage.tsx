
import React, { useState, useRef, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

const formatTime = (time: number) => {
    const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
    const s = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const m = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
    const h = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
    return { h, m, s, ms };
};

const StopwatchPage: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timeRef = useRef(0);

    useInterval(
        () => {
            setTime(prevTime => prevTime + 10);
        },
        isRunning ? 10 : null
    );

    const handleToggle = useCallback(() => {
        setIsRunning(prev => !prev);
    }, []);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    }, []);

    const handleLap = useCallback(() => {
        if (isRunning) {
            setLaps(prev => [...prev, time]);
        }
    }, [isRunning, time]);

    const { h, m, s, ms } = formatTime(time);
    const lastLap = laps.length > 0 ? laps[laps.length - 1] : 0;
    
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
                    {laps.slice().reverse().map((lap, index) => {
                        const { h, m, s, ms } = formatTime(lap);
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
