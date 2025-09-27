import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Settings, Alarm, Notes, Page } from './types';
import { QUOTES, CITY_DATA } from './constants';
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
import { TRANSLATIONS } from './constants';
import { getHourInTimezone } from './utils/time';

const App: React.FC = () => {
    const [now, setNow] = useState(new Date());
    const [mainClock, setMainClock] = useState<Clock | null>(null);
    const [pinnedClocks, setPinnedClocks] = useState<Clock[]>([]);
    const [settings, setSettings] = useState<Settings>({
        autoTheme: true,
        manualThemeDark: false,
        is24Hour: true,
        language: 'en'
    });
    const [currentPage, setCurrentPage] = useState<Page>(Page.Time);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [notes, setNotes] = useState<Notes>({});
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    const t = useMemo(() => TRANSLATIONS[settings.language], [settings.language]);

    // Main Clock Tick
    useInterval(() => setNow(new Date()), 1000);
    
    // Load state from localStorage on initial mount
    useEffect(() => {
        const savedState = localStorage.getItem('airclockState');
        if (savedState) {
            const { pinnedTimezones, notes: savedNotes, settings: savedSettings, alarms: savedAlarms } = JSON.parse(savedState);
            if (savedSettings) setSettings(s => ({...s, ...savedSettings}));
            if (savedNotes) setNotes(savedNotes);
            if (savedAlarms) setAlarms(savedAlarms.map((a: Alarm) => ({...a, triggeredToday: false})));
            
            if (pinnedTimezones && pinnedTimezones.length > 0) {
                Promise.all(pinnedTimezones.map(createClockObject)).then(loadedClocks => {
                    setPinnedClocks(loadedClocks.filter((c): c is Clock => c !== null));
                });
            }
        }

        getInitialTimezone().then(async (tz) => {
            const clock = await createClockObject(tz);
            if(clock) {
                const mainCity = CITY_DATA.find(c => c.timezone === clock.timezone);
                setMainClock({...clock, name: mainCity ? mainCity.name : clock.timezone.split('/').pop()?.replace(/_/g, ' ') });
            }
        });
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        const stateToSave = {
            pinnedTimezones: pinnedClocks.map(c => c.timezone),
            notes,
            settings,
            alarms: alarms.map(({triggeredToday, ...rest}) => rest), // Don't save transient state
        };
        localStorage.setItem('airclockState', JSON.stringify(stateToSave));
    }, [pinnedClocks, notes, settings, alarms]);

    // Theme Management
    useEffect(() => {
        const root = window.document.documentElement;
        let isDark = settings.manualThemeDark;
        if (settings.autoTheme) {
            if (mainClock) {
                const localTime = new Date(now.getTime() + mainClock.offset);
                const hour = getHourInTimezone(localTime, mainClock.timezone);
                isDark = hour < 6 || hour >= 18;
            } else {
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        }
        root.classList.toggle('dark', isDark);
    }, [settings.autoTheme, settings.manualThemeDark, mainClock, now]);

    const addClock = useCallback(async (timezone: string) => {
        if (pinnedClocks.some(c => c.timezone === timezone)) return;
        const newClock = await createClockObject(timezone);
        if (newClock) {
            setPinnedClocks(prev => [...prev, newClock]);
        }
    }, [pinnedClocks]);

    const removeClock = useCallback((timezone: string) => {
        setPinnedClocks(prev => prev.filter(c => c.timezone !== timezone));
    }, []);

    const handleReset = () => {
        if (window.confirm(t.alerts.resetConfirm)) {
            localStorage.removeItem('airclockState');
            window.location.reload();
        }
    };

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
    
    // Quote of the day logic
    const quote = useMemo(() => {
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        return QUOTES[dayOfYear % QUOTES.length];
    }, [now]);
    
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

            <AppFooter quote={quote} />
            
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