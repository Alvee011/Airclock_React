
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Settings, Notes } from '../types';
import { CITY_DATA } from '../constants';
import { createClockObject } from '../services/worldTime';
import { Modal } from './Modal';
import MainClock from './MainClock';
import FullScreenClock from './FullScreenClock';
import ClockCard from './ClockCard';
import PopularCities from './PopularCities';
import Calendar from './Calendar';
import DatePickerModal from './DatePickerModal';
import FocusSounds from './FocusSounds';

// Debounce helper function
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

const getDateString = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

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

const TimePage: React.FC<TimePageProps> = ({ now, mainClock, pinnedClocks, addClock, removeClock, notes, setNotes, settings, t, handleReset, setPinnedClocks }) => {
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{name: string, country: string, timezone: string, flag: string}[]>([]);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAllNotesOpen, setIsAllNotesOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [focusMode, setFocusMode] = useState<{ active: boolean; videoId?: string }>({ active: false });
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleFocusToggle = useCallback((active: boolean, videoId?: string) => {
        setFocusMode({ active, videoId });
        if (active) {
            setIsFullscreen(true);
        }
    }, []);

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
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm.toLowerCase());
    }, [searchTerm, debouncedSearch]);
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        const refreshPromises = pinnedClocks.map(clock => createClockObject(clock.timezone));
        const refreshedClocks = await Promise.all(refreshPromises);
        setPinnedClocks(refreshedClocks.filter((c): c is Clock => c !== null));
        setIsRefreshing(false);
    };
    
    const closeFullscreen = () => {
        setIsFullscreen(false);
        // If focus mode was active, we need to deactivate it.
        // This will be handled by the FocusSounds component via onFocusModeToggle
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {pinnedClocks.length > 0 ? pinnedClocks.map(clock => (
                    <ClockCard key={clock.timezone} now={now} clock={clock} mainClock={mainClock} removeClock={removeClock} settings={settings} t={t} />
                 )) : (
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 opacity-60">{t.alerts.noPinned}</div>
                 )}
            </div>

            <PopularCities addClock={addClock} />

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
                                delete newNotes[dateStr];
                            }
                            setNotes(newNotes);
                        }}
                        placeholder={t.placeholders.notes}
                        className="w-full min-h-[280px] p-4 bg-white dark:bg-card-dark rounded-2xl border border-transparent focus:border-accent-light dark:focus:border-accent-dark focus:ring-2 focus:ring-accent-light/50 dark:focus:ring-accent-dark/50 outline-none transition-all shadow-lg"
                    />
                </Section>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
                 <button onClick={handleRefresh} disabled={isRefreshing} className="px-6 py-3 font-semibold rounded-full bg-white dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-wait">
                    {isRefreshing ? 'Refreshing...' : t.ui.refresh}
                </button>
                 <button onClick={() => setIsAllNotesOpen(true)} className="px-6 py-3 font-semibold rounded-full bg-white dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors shadow-md">{t.ui.showAllNotes}</button>
                 <button onClick={handleReset} className="px-6 py-3 font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md">{t.ui.reset}</button>
            </div>

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

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">{title}</h2>
        {children}
    </div>
);

export default TimePage;
