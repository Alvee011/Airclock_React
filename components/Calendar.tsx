/**
 * @file Renders an interactive calendar component.
 */

import React, { useMemo } from 'react';
import { Notes } from '../types';
import { getDateString } from '../utils/time';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// Helper to check if two Date objects represent the same day.
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

interface CalendarProps {
    /** The date that determines the currently displayed month and year. */
    currentCalendarDate: Date;
    /** The currently selected date. */
    selectedDate: Date;
    /** Callback to update the selected date. */
    setSelectedDate: (date: Date) => void;
    /** The notes object, to show indicators on days with notes. */
    notes: Notes;
    /** The translation object. */
    t: any;
    /** Callback triggered when the month/year title is clicked, usually to open a date picker. */
    onTitleClick: () => void;
}

/**
 * The Calendar component displays a monthly grid of days. It allows for navigation
 * between months, selection of a specific day, and visually indicates the current day,
 * the selected day, and days that have notes associated with them.
 */
const Calendar: React.FC<CalendarProps> = ({ currentCalendarDate, selectedDate, setSelectedDate, notes, t, onTitleClick }) => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Memoized calculation of the days to render in the grid for the current month.
    // It includes padding for empty cells at the start of the month.
    const daysInMonth = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0=Sun, 6=Sat)
        const numDays = new Date(year, month + 1, 0).getDate(); // Total days in the month
        const days = Array(firstDay).fill(null); // Add nulls for empty cells
        for (let i = 1; i <= numDays; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [year, month]);

    const today = useMemo(() => new Date(), []);
    
    // Navigate to the previous month.
    const handlePrevMonth = () => {
        // We set the `selectedDate` to keep the day selection consistent when possible.
        setSelectedDate(new Date(year, month - 1, selectedDate.getDate()));
    };

    // Navigate to the next month.
    const handleNextMonth = () => {
        setSelectedDate(new Date(year, month + 1, selectedDate.getDate()));
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-500/10"><ChevronLeftIcon/></button>
                <h3 className="font-bold text-lg cursor-pointer hover:opacity-80" onClick={onTitleClick}>{t.calendar.months[month]} {year}</h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-500/10"><ChevronRightIcon/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {/* Render weekday headers */}
                {t.calendar.weekdays.map((day: string) => <div key={day} className="font-bold text-xs opacity-50 mb-2">{day}</div>)}
                
                {/* Render the days of the month */}
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>; // Empty cell
                    
                    const dateStr = getDateString(day);
                    const isToday = isSameDay(day, today);
                    const isSelected = isSameDay(day, selectedDate);
                    const hasNote = notes[dateStr];

                    // Dynamically build CSS classes based on the day's state.
                    let dayClasses = "relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 mx-auto";
                    if(isToday) dayClasses += " bg-accent-light dark:bg-accent-dark text-white font-bold";
                    if(isSelected) dayClasses += " ring-2 ring-offset-2 ring-accent-light dark:ring-accent-dark ring-offset-white dark:ring-offset-card-dark";
                    if(!isToday && !isSelected) dayClasses += " hover:bg-gray-100 dark:hover:bg-gray-700";
                    
                    return (
                        <div key={dateStr} onClick={() => setSelectedDate(day)} className={dayClasses}>
                            {day.getDate()}
                            {/* Blue dot indicator for days with notes */}
                            {hasNote && <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;