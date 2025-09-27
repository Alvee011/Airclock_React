/**
 * @file This is the root component of the AirClock application.
 * It orchestrates the entire application's state, navigation, and data flow.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Settings, Alarm, Notes, Page } from './types';
import { API_BASE_URL, CITY_DATA, TRANSLATIONS } from './constants';
import { createClockObject, getInitialTimezone } from './services/worldTime';
import { useInterval } from './hooks/useInterval';
import TimePage from './components/TimePage';
import StopwatchPage from './components/StopwatchPage';
import TimerPage from './components/TimerPage';
import AlarmPage from './components/AlarmPage';
import Header from './components/Header';
import NavMenu from './components/NavMenu';
import AppFooter from './components/AppFooter';
import SettingsModal from './components/SettingsModal';
import { getHourInTimezone } from './utils/time';

/**
 * The main application component.
 * Manages global state including time, clocks, settings, notes, alarms, and navigation.
 * It also handles loading/saving state from/to localStorage and theme management.
 */
const App: React.FC = () => {
    // --- STATE MANAGEMENT ---

    // `now` is a Date object that updates every second, driving all the clocks in the app.
    const [now, setNow] = useState(new Date());
    // The offset between the server's atomic time and the client's local clock.
    const [serverTimeOffset, setServerTimeOffset] = useState(0);

    // `mainClock` holds the clock data for the user's primary timezone.
    const [mainClock, setMainClock] = useState<Clock | null>(null);
    
    // `pinnedClocks` is an array of additional clocks the user has added.
    const [pinnedClocks, setPinnedClocks] = useState<Clock[]>([]);
    
    // `settings` stores all user-configurable options like theme, time format, and language.
    const [settings, setSettings] = useState<Settings>({
        autoTheme: true,
        manualThemeDark: false,
        is24Hour: true,
        language: 'en'
    });
    
    // `currentPage` controls which main view (Time, Stopwatch, etc.) is currently displayed.
    const [currentPage, setCurrentPage] = useState<Page>(Page.Time);
    
    // UI state for managing the visibility of modals and menus.
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // State for calendar notes and alarms.
    const [notes, setNotes] = useState<Notes>({});
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    // Memoized translation object based on the current language setting.
    const t = useMemo(() => TRANSLATIONS[settings.language], [settings.language]);

    // --- EFFECTS AND LOGIC ---

    // The main interval updates `now` every second, corrected by the server offset for atomic precision.
    useInterval(() => {
        setNow(new Date(Date.now() + serverTimeOffset));
    }, 1000);
    
    // Effect to load the application's state from localStorage and perform the initial time sync.
    useEffect(() => {
        const savedState = localStorage.getItem('airclockState');
        if (savedState) {
            const { pinnedTimezones, notes: savedNotes, settings: savedSettings, alarms: savedAlarms } = JSON.parse(savedState);
            if (savedSettings) setSettings(s => ({...s, ...savedSettings}));
            if (savedNotes) setNotes(savedNotes);
            if (savedAlarms) setAlarms(savedAlarms.map((a: Alarm) => ({...a, triggeredToday: false})));
            
            // If there are saved timezones, fetch their current data.
            if (pinnedTimezones && pinnedTimezones.length > 0) {
                Promise.all(pinnedTimezones.map(createClockObject)).then(loadedClocks => {
                    setPinnedClocks(loadedClocks.filter((c): c is Clock => c !== null));
                });
            }
        }

        // Determine user's timezone, set it as the main clock, and perform the first time sync.
        getInitialTimezone().then(async (tz) => {
            const clock = await createClockObject(tz);
            if(clock) {
                if (!clock.apiFailed) {
                    // Calculate the offset between the authoritative server time and the client's local clock.
                    const offset = (clock.unixtime * 1000) - Date.now();
                    setServerTimeOffset(offset);
                }
                const mainCity = CITY_DATA.find(c => c.timezone === clock.timezone);
                setMainClock({...clock, name: mainCity ? mainCity.name : clock.timezone.split('/').pop()?.replace(/_/g, ' ') });
            }
        });
    }, []); // Empty dependency array means this runs only once on mount.

    // Periodically re-sync with the server to correct for client-side clock drift.
    useInterval(async () => {
        if (!mainClock || mainClock.apiFailed) {
            return; // Don't sync if we don't have a valid main clock
        }
        try {
            const response = await fetch(`${API_BASE_URL}/timezone/${mainClock.timezone}`);
            if (!response.ok) {
                throw new Error(`Periodic sync failed with status ${response.status}`);
            }
            const data = await response.json();
            const offset = (data.unixtime * 1000) - Date.now();
            setServerTimeOffset(offset);
        } catch (error) {
            console.warn('Periodic time sync failed:', error);
        }
    }, 5 * 60 * 1000); // Sync every 5 minutes

    // Effect to save the current state to localStorage whenever a key piece of state changes.
    useEffect(() => {
        const stateToSave = {
            pinnedTimezones: pinnedClocks.map(c => c.timezone),
            notes,
            settings,
            alarms: alarms.map(({triggeredToday, ...rest}) => rest), // Don't save transient state like `triggeredToday`.
        };
        localStorage.setItem('airclockState', JSON.stringify(stateToSave));
    }, [pinnedClocks, notes, settings, alarms]);

    // Effect to manage the theme (dark/light mode).
    // It can be either automatic based on the main clock's time (day/night) or manually set by the user.
    useEffect(() => {
        const root = window.document.documentElement;
        let isDark = settings.manualThemeDark;
        if (settings.autoTheme) {
            if (mainClock) {
                // In auto mode, theme is based on the local time of the main clock.
                const hour = getHourInTimezone(now, mainClock.timezone);
                isDark = hour < 6 || hour >= 18; // Dark theme from 6 PM to 6 AM.
            } else {
                // Fallback to the user's OS preference if the main clock isn't loaded yet.
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        }
        root.classList.toggle('dark', isDark);
    }, [settings.autoTheme, settings.manualThemeDark, mainClock, now]);

    // --- CALLBACKS ---

    // Reusable callback to refresh only the clocks that have failed.
    const refreshFailedClocks = useCallback(async () => {
        const clocksToRefresh = pinnedClocks.filter(c => c.apiFailed);
        if (clocksToRefresh.length === 0) return;

        const refreshPromises = clocksToRefresh.map(clock => createClockObject(clock.timezone));
        const refreshedClocksData = await Promise.all(refreshPromises);

        const refreshedClocksMap = new Map<string, Clock>();
        refreshedClocksData.forEach(clock => {
            if (clock && !clock.apiFailed) { // Only update if refresh was successful
                refreshedClocksMap.set(clock.timezone, clock);
            }
        });

        if (refreshedClocksMap.size > 0) {
            setPinnedClocks(prevClocks =>
                prevClocks.map(oldClock =>
                    refreshedClocksMap.get(oldClock.timezone) || oldClock
                )
            );
        }
    }, [pinnedClocks]);

    // Callback to add a new clock to the pinned list. Wrapped in useCallback for performance.
    const addClock = useCallback(async (timezone: string) => {
        if (pinnedClocks.some(c => c.timezone === timezone)) return; // Avoid duplicates
        const newClock = await createClockObject(timezone);
        if (newClock) {
            setPinnedClocks(prev => [...prev, newClock]);
            // If the new clock failed to load, schedule a targeted retry in 3 seconds.
            if (newClock.apiFailed) {
                setTimeout(() => {
                    refreshFailedClocks();
                }, 3000);
            }
        }
    }, [pinnedClocks, refreshFailedClocks]);

    // Callback to remove a clock from the pinned list.
    const removeClock = useCallback((timezone: string) => {
        setPinnedClocks(prev => prev.filter(c => c.timezone !== timezone));
    }, []);

    // Function to reset all application data.
    const handleReset = () => {
        if (window.confirm(t.alerts.resetConfirm)) {
            localStorage.removeItem('airclockState');
            window.location.reload();
        }
    };
    
    // Automatic self-healing for failed clock cards, checking every 5 seconds.
    useInterval(refreshFailedClocks, 5000);

    // --- RENDER LOGIC ---

    // Dynamically renders the component for the currently selected page.
    const renderPage = () => {
        switch (currentPage) {
            case Page.Stopwatch: return <StopwatchPage />;
            case Page.Timer: return <TimerPage />;
            case Page.Alarm: return <AlarmPage alarms={alarms} setAlarms={setAlarms} t={t} />;
            case Page.Time:
            default:
                return <TimePage
                    now={now}
                    mainClock={mainClock}
                    pinnedClocks={pinnedClocks}
                    addClock={addClock}
                    removeClock={removeClock}
                    notes={notes}
                    setNotes={setNotes}
                    settings={settings}
                    t={t}
                    handleReset={handleReset}
                    setPinnedClocks={setPinnedClocks}
                />;
        }
    };
    
    return (
        <div className="bg-gray-200 dark:bg-black text-gray-800 dark:text-gray-100 min-h-screen flex flex-col font-sans transition-colors duration-300">
            <Header 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onNavOpen={() => setIsNavOpen(true)}
                onSettingsOpen={() => setIsSettingsOpen(true)}
            />

            <NavMenu 
                isOpen={isNavOpen}
                onClose={() => setIsNavOpen(false)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderPage()}
                </div>
            </main>

            <AppFooter />
            
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                setSettings={setSettings}
                t={t}
            />
        </div>
    );
};

export default App;
