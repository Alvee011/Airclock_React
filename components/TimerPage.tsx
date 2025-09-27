
import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

const TimerPage: React.FC = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(10);
    const [seconds, setSeconds] = useState(0);

    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        if (!isActive) {
            setRemainingSeconds(hours * 3600 + minutes * 60 + seconds);
        }
    }, [hours, minutes, seconds, isActive]);

    useInterval(() => {
        if (remainingSeconds > 0) {
            setRemainingSeconds(s => s - 1);
        } else {
            setIsActive(false);
            // Optionally play a sound
            alert("Timer finished!");
        }
    }, isActive ? 1000 : null);
    
    const handleToggle = useCallback(() => {
        if(remainingSeconds > 0) {
            setIsActive(prev => !prev);
        }
    }, [remainingSeconds]);
    
    const handleReset = useCallback(() => {
        setIsActive(false);
        setRemainingSeconds(hours * 3600 + minutes * 60 + seconds);
    }, [hours, minutes, seconds]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

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

    return (
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-card-dark rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Timer</h2>
            <div className="text-center font-mono text-7xl font-bold tracking-tighter mb-8">
                {formatTime(remainingSeconds)}
            </div>
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
