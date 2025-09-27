
import React, { useState, useCallback } from 'react';
import { Alarm } from '../types';
import { useInterval } from '../hooks/useInterval';
import ToggleSwitch from './ToggleSwitch';

interface AlarmPageProps {
    alarms: Alarm[];
    setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
    t: any;
}

const AlarmPage: React.FC<AlarmPageProps> = ({ alarms, setAlarms, t }) => {
    const [time, setTime] = useState('');
    const [label, setLabel] = useState('');

    const [now, setNow] = useState(new Date());
    useInterval(() => setNow(new Date()), 1000); // For countdown

    const handleAddAlarm = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!time) return;
        const newAlarm: Alarm = {
            id: Date.now(),
            time,
            label: label || 'Alarm',
            enabled: true,
            triggeredToday: false,
        };
        setAlarms(prev => [...prev, newAlarm].sort((a,b) => a.time.localeCompare(b.time)));
        setTime('');
        setLabel('');
    }, [time, label, setAlarms]);

    const handleToggleAlarm = (id: number) => {
        setAlarms(alarms.map(a => a.id === id ? {...a, enabled: !a.enabled} : a));
    };

    const handleDeleteAlarm = (id: number) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const getCountdown = (alarmTime: string) => {
        const [hours, minutes] = alarmTime.split(':').map(Number);
        const alarmDate = new Date(now);
        alarmDate.setHours(hours, minutes, 0, 0);

        if (alarmDate < now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }

        const diff = alarmDate.getTime() - now.getTime();
        const h = Math.floor(diff / 1000 / 60 / 60);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return `Rings in ${h}h ${m}m ${s}s`;
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white dark:bg-card-dark rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Alarm</h2>
            <form onSubmit={handleAddAlarm} className="flex gap-4 mb-8">
                <input 
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)}
                    required
                    className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-transparent focus:border-accent-light dark:focus:border-accent-dark outline-none"
                />
                <input 
                    type="text" 
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder={t.placeholders.alarmLabel}
                    className="flex-grow p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-transparent focus:border-accent-light dark:focus:border-accent-dark outline-none"
                />
                <button type="submit" className="px-6 py-3 font-semibold rounded-lg bg-accent-light dark:bg-accent-dark text-white hover:opacity-90 transition-opacity">Add</button>
            </form>
            <ul className="space-y-4">
                {alarms.map(alarm => (
                    <li key={alarm.id} className={`p-4 rounded-lg transition-opacity duration-300 ${alarm.enabled ? '' : 'opacity-50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <p className={`font-mono text-4xl font-bold ${alarm.enabled ? '' : 'line-through'}`}>{alarm.time}</p>
                                <p className={`mt-1 text-gray-600 dark:text-gray-400 ${alarm.enabled ? '' : 'line-through'}`}>{alarm.label}</p>
                                {alarm.enabled && <p className="text-xs mt-2 text-accent-light dark:text-accent-dark font-mono">{getCountdown(alarm.time)}</p>}
                            </div>
                            <div className="flex items-center gap-4">
                                <ToggleSwitch
                                    checked={alarm.enabled}
                                    onChange={() => handleToggleAlarm(alarm.id)}
                                />
                                <button onClick={() => handleDeleteAlarm(alarm.id)} className="text-red-500 hover:text-red-700 text-2xl">&times;</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlarmPage;
