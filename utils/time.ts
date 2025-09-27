import { Clock, Settings } from '../types';

export const formatTime = (date: Date, clock: Clock, settings: Settings) => {
    const time = new Date(date.getTime() + clock.offset);
    return time.toLocaleTimeString(settings.language, {
        timeZone: 'UTC',
        hour12: !settings.is24Hour,
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

export const formatDate = (date: Date, clock: Clock, settings: Settings, format: 'long' | 'short' = 'long') => {
    const time = new Date(date.getTime() + clock.offset);
    return time.toLocaleDateString(settings.language, {
        timeZone: 'UTC',
        weekday: format, year: 'numeric', month: format, day: 'numeric'
    });
};

export const getHourInTimezone = (date: Date, timezone: string): number => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
    });
    const hourString = formatter.format(date);
    // The formatter can return "24" for midnight in some locales, so we use modulo.
    return parseInt(hourString, 10) % 24;
};