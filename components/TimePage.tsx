/**
 * @file This component serves as the main view of the application, displaying clocks, calendar, notes, and other features.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Settings, Notes } from '../types';
import { CITY_DATA } from '../constants';
import { createClockObject } from '../services/worldTime';
import { getDateString } from '../utils/time';
import { Modal } from './Modal';
import MainClock from './MainClock';
import FullScreenClock from './FullScreenClock';
import ClockCard from './ClockCard';
import PopularCities from './PopularCities';
import Calendar from './Calendar';
import DatePickerModal from './DatePickerModal';
import FocusSounds from './FocusSounds';

/**
 * A simple debounce utility function.
 * It delays the execution of a function until after a specified time has elapsed since the last time it was invoked.
 * @param {F} func The function to debounce.
 * @param {number} waitFor The delay in milliseconds.
 * @returns A debounced version of the function.
 */
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

interface TimePageProps {
    now: Date;
    mainClock: Clock | null;
    pinnedClocks: Clock[];
    addClock: (timezone: string) => void;
    removeClock: (timezone: string) => void;
    notes: Notes;
    setNotes: React.Dispatch<React.SetStateAction<Notes>>;
    settings: Settings;
    t: any;
    handleReset: () => void;
    setPinnedClocks: React.Dispatch<React.SetStateAction<Clock[]>>;
}

/**
 * The main page component that aggregates all time-related features.
 */
const TimePage: React.FC<TimePageProps> = ({ now, mainClock, pinnedClocks, addClock, removeClock, notes, setNotes, settings, t, handleReset, setPinnedClocks }) => {
    
    // --- UI State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{name: string, country: string, timezone: string, flag: string}[]>([]);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date()); // The month/year view of the calendar
    const [selectedDate, setSelectedDate] = useState(new Date()); // The currently selected day
    const [isAllNotesOpen, setIsAllNotesOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [focusMode, setFocusMode] = useState<{ active: boolean; videoId?: string }>({ active: false });
    const [isRefreshing, setIsRefreshing] = useState(false); // For the "Refresh Cards" button

    // Toggles focus mode, which also enters the full-screen clock view.
    const handleFocusToggle = useCallback((active: boolean, videoId?: string) => {
        setFocusMode({ active, videoId });
        if (active) {
            setIsFullscreen(true);
        }
    }, []);

    // Debounced search function to avoid excessive filtering on every keystroke.
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (query) {
                const filtered = CITY_DATA.filter(c =>
                    c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)
                );
                setSearchResults(filtered);
            } else {
                setSearchResults([]);
            }
        }, 300), // 300ms delay
        []
    );

    // Effect to trigger the debounced search when the search term changes.
    useEffect(() => {
        debouncedSearch(searchTerm.toLowerCase());
    }, [searchTerm, debouncedSearch]);
    
    // Manually refreshes the data ONLY for pinned clocks that have failed.
    const handleRefresh = async () => {
        const clocksToRefresh = pinnedClocks.filter(clock => clock.apiFailed);
        if (clocksToRefresh.length === 0) return; // Nothing to refresh

        setIsRefreshing(true);
        const refreshPromises = clocksToRefresh.map(clock => createClockObject(clock.timezone));
        const refreshedClocksData = await Promise.all(refreshPromises);

        // Create a map for efficient updates.
        const refreshedClocksMap = new Map<string, Clock>();
        refreshedClocksData.forEach(clock => {
            if (clock) {
                refreshedClocksMap.set(clock.timezone, clock);
            }
        });

        // Update the state by merging the refreshed data with the existing clocks.
        setPinnedClocks(prevClocks => 
            prevClocks.map(oldClock => {
                if (refreshedClocksMap.has(oldClock.timezone)) {
                    return refreshedClocksMap.get(oldClock.timezone)!;
                }
                return oldClock;
            })
        );
        
        setIsRefreshing(false);
    };
    
    // Closes the full-screen clock view and deactivates focus mode if it was active.
    const closeFullscreen = () => {
        setIsFullscreen(false);
        if (focusMode.active) {
             handleFocusToggle(false);
        }
    }

    return (
        <div className="space-y-8">
            {mainClock && (
                <MainClock now={now} mainClock={mainClock} settings={settings} onFullscreen={() => setIsFullscreen(true)}>
                    <FocusSounds onFocusModeToggle={handleFocusToggle} />
                </MainClock>
            )}
            
            {/* Search bar for adding new clocks */}
            <div className="relative max-w-2xl mx-auto">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.placeholders.search}
                    className="w-full p-4 rounded-full bg-white dark:bg-card-dark border border-transparent focus:border-accent-light dark:focus:border-accent-dark focus:ring-2 focus:ring-accent-light/50 dark:focus:ring-accent-dark/50 outline-none transition-all shadow-md"
                />
                {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-card-dark rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {searchResults.map(city => (
                            <div key={city.timezone} onClick={() => { addClock(city.timezone); setSearchTerm(''); setSearchResults([]); }} className="p-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <span className="text-2xl">{city.flag}</span>
                                <span>{city.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Grid of pinned clock cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {pinnedClocks.length > 0 ? pinnedClocks.map(clock => (
                    <ClockCard key={clock.timezone} now={now} clock={clock} mainClock={mainClock} removeClock={removeClock} settings={settings} t={t} />
                 )) : (
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 opacity-60">{t.alerts.noPinned}</div>
                 )}
            </div>

            <PopularCities addClock={addClock} />

            {/* Calendar and Notes section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Section title={t.ui.calendar}>
                     <Calendar 
                        currentCalendarDate={currentCalendarDate}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        notes={notes}
                        t={t}
                        onTitleClick={() => setIsDatePickerOpen(true)}
                    />
                </Section>
                 <Section title={`${t.ui.notes} ${selectedDate.toLocaleDateString(settings.language)}`}>
                    <textarea 
                        value={notes[getDateString(selectedDate)] || ''}
                        onChange={(e) => {
                            const newNotes = {...notes};
                            const dateStr = getDateString(selectedDate);
                            if (e.target.value) {
                                newNotes[dateStr] = e.target.value;
                            } else {
                                delete newNotes[dateStr]; // Remove note if text is cleared
                            }
                            setNotes(newNotes);
                        }}
                        placeholder={t.placeholders.notes}
                        className="w-full min-h-[280px] p-4 bg-white dark:bg-card-dark rounded-2xl border border-transparent focus:border-accent-light dark:focus:border-accent-dark focus:ring-2 focus:ring-accent-light/50 dark:focus:ring-accent-dark/50 outline-none transition-all shadow-lg"
                    />
                </Section>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
                 <button onClick={handleRefresh} disabled={isRefreshing} className="px-6 py-3 font-semibold rounded-full bg-white dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-wait">
                    {isRefreshing ? 'Refreshing...' : t.ui.refresh}
                </button>
                 <button onClick={() => setIsAllNotesOpen(true)} className="px-6 py-3 font-semibold rounded-full bg-white dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors shadow-md">{t.ui.showAllNotes}</button>
                 <button onClick={handleReset} className="px-6 py-3 font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md">{t.ui.reset}</button>
            </div>

            {/* Modals */}
            {mainClock && <FullScreenClock 
                isOpen={isFullscreen}
                onClose={closeFullscreen}
                now={now}
                mainClock={mainClock}
                settings={settings}
                focusMode={focusMode}
            />}
            
            <DatePickerModal 
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                currentCalendarDate={currentCalendarDate}
                setCurrentCalendarDate={setCurrentCalendarDate}
                t={t}
            />

            <Modal isOpen={isAllNotesOpen} onClose={() => setIsAllNotesOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">{t.ui.allNotes}</h2>
                <div className="overflow-y-auto pr-2">
                    {Object.keys(notes).length > 0 ? (
                        Object.keys(notes).sort().map(dateKey => (
                            <div key={dateKey} className="mb-4 pb-4 border-b border-black/10 dark:border-white/10 last:border-b-0">
                                <p className="font-semibold text-accent-light dark:text-accent-dark">{new Date(dateKey+'T00:00:00').toLocaleDateString(settings.language)}</p>
                                <p className="whitespace-pre-wrap mt-1">{notes[dateKey]}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t.ui.noNotes}</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

// A simple wrapper component to provide a consistent section header style.
const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">{title}</h2>
        {children}
    </div>
);

export default TimePage;
