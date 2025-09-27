
import { API_BASE_URL, CITY_DATA } from '../constants';
import { Clock } from '../types';

export const createClockObject = async (timezone: string): Promise<Clock | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/timezone/${timezone}`);
        if (!response.ok) throw new Error(`API fetch failed for ${timezone}`);
        const data = await response.json();
        const cityInfo = CITY_DATA.find(c => c.timezone === data.timezone) || {};
        return { ...data, ...cityInfo, offset: new Date(data.utc_datetime).getTime() - Date.now(), apiFailed: false };
    } catch (error) {
        console.warn(`Error fetching clock data for ${timezone}:`, error);
        // FIX: Find cityInfo without `|| {}` and use optional chaining below to prevent type errors.
        const cityInfo = CITY_DATA.find(c => c.timezone === timezone);
        const fallbackName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
        return { 
            ...({} as Clock), 
            timezone, 
            // FIX: Safely access properties on potentially undefined cityInfo.
            name: cityInfo?.name || fallbackName, 
            flag: cityInfo?.flag, 
            apiFailed: true, 
            offset: 0 
        };
    }
};

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
