/**
 * @file This service handles all interactions with the WorldTimeAPI.
 * It provides functions to fetch time data for a specific timezone and to determine the user's timezone based on their IP address.
 */

import { API_BASE_URL, CITY_DATA } from '../constants';
import { Clock } from '../types';

/**
 * Fetches time data for a given timezone and constructs a Clock object.
 * It merges the API response with local city data (like name and flag).
 * Includes a robust fallback mechanism for API failures.
 * @param {string} timezone - The IANA timezone name (e.g., "America/New_York").
 * @returns {Promise<Clock | null>} A promise that resolves to a Clock object, or null if the process fails unexpectedly.
 */
export const createClockObject = async (timezone: string): Promise<Clock | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/timezone/${timezone}`);
        if (!response.ok) throw new Error(`API fetch failed for ${timezone}`);
        const data = await response.json();
        
        // Find corresponding city info from our local constants to add name and flag.
        const cityInfo = CITY_DATA.find(c => c.timezone === data.timezone) || {};
        
        return { ...data, ...cityInfo, apiFailed: false };
    } catch (error) {
        console.warn(`Error fetching clock data for ${timezone}:`, error);
        
        // Fallback logic: If the API fails, create a placeholder Clock object.
        // This allows the UI to still display the card with an error message instead of crashing.
        const cityInfo = CITY_DATA.find(c => c.timezone === timezone);
        const fallbackName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
        
        return { 
            ...({} as Clock), // Start with an empty Clock-like object
            timezone, 
            name: cityInfo?.name || fallbackName, 
            flag: cityInfo?.flag, 
            apiFailed: true, 
        };
    }
};

/**
 * Determines the user's initial timezone.
 * It first tries to get the timezone from the WorldTimeAPI using the user's IP.
 * If that fails, it falls back to the browser's local timezone.
 * @returns {Promise<string>} A promise that resolves to the user's timezone name.
 */
export const getInitialTimezone = async (): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/ip`);
        if (!response.ok) throw new Error("IP API failed");
        return (await response.json()).timezone;
    } catch (e) {
        console.warn("IP lookup failed. Using browser's local timezone as fallback.");
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}