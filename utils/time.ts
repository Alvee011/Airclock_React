/**
 * @file This file contains utility functions for formatting time and dates throughout the application.
 */

import { Clock, Settings } from '../types';

/**
 * Formats a date object into a time string based on a clock's offset and user settings.
 * @param {Date} date - The base Date object (usually the app's `now` state).
 * @param {Clock} clock - The clock object containing the timezone and offset.
 * @param {Settings} settings - The user's settings, specifically for language and 12/24-hour format.
 * @returns {string} The formatted time string (e.g., "02:30:45 PM" or "14:30:45").
 */
export const formatTime = (date: Date, clock: Clock, settings: Settings): string => {
    if (clock.apiFailed) return '--:--:--';
    try {
        return date.toLocaleTimeString(settings.language, {
            timeZone: clock.timezone,
            hour12: !settings.is24Hour,
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    } catch (e) {
        console.error(`Failed to format time for timezone: ${clock.timezone}`, e);
        return '--:--:--';
    }
};

/**
 * Formats a date object into a date string based on a clock's offset and user settings.
 * @param {Date} date - The base Date object.
 * @param {Clock} clock - The clock object containing the timezone and offset.
 * @param {Settings} settings - The user's settings, specifically for language.
 * @param {'long' | 'short'} [format='long'] - The desired format for weekday and month ('long' or 'short').
 * @returns {string} The formatted date string (e.g., "Tuesday, June 1, 2024").
 */
export const formatDate = (date: Date, clock: Clock, settings: Settings, format: 'long' | 'short' = 'long'): string => {
    if (clock.apiFailed) return 'Time data unavailable';
    try {
        return date.toLocaleDateString(settings.language, {
            timeZone: clock.timezone,
            weekday: format, year: 'numeric', month: format, day: 'numeric'
        });
    } catch (e) {
        console.error(`Failed to format date for timezone: ${clock.timezone}`, e);
        return 'Invalid timezone data';
    }
};

/**
 * Gets the numerical hour (0-23) for a given date in a specific timezone.
 * This is useful for determining day/night for theme switching.
 * @param {Date} date - The date to check.
 * @param {string} timezone - The IANA timezone name.
 * @returns {number} The hour of the day (0-23).
 */
export const getHourInTimezone = (date: Date, timezone: string): number => {
    try {
        // Use Intl.DateTimeFormat to reliably get the hour in any timezone.
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone,
        });
        const hourString = formatter.format(date);
        // The formatter can return "24" for midnight in some locales, so we use modulo to ensure it's 0.
        return parseInt(hourString, 10) % 24;
    } catch(e) {
        console.error(`Failed to get hour for timezone: ${timezone}`, e);
        return date.getHours(); // Fallback to system's local hour
    }
};

/**
 * Gets a date string in "YYYY-MM-DD" format, used as a key for notes.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const getDateString = (date: Date): string => 
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`