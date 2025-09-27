
import React, { useMemo } from 'react';
import { Notes } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// Helper to check if two dates are the same day
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const getDateString = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

interface CalendarProps {
    currentCalendarDate: Date;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    notes: Notes;
    t: any;
    onTitleClick: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentCalendarDate, selectedDate, setSelectedDate, notes, t, onTitleClick }) => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const daysInMonth = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const numDays = new Date(year, month + 1, 0).getDate();
        const days = Array(firstDay).fill(null);
        for (let i = 1; i <= numDays; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [year, month]);

    const today = useMemo(() => new Date(), []);
    
    const handlePrevMonth = () => {
        setSelectedDate(new Date(year, month - 1, selectedDate.getDate()));
    };

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
                {t.calendar.weekdays.map((day: string) => <div key={day} className="font-bold text-xs opacity-50 mb-2">{day}</div>)}
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;
                    const dateStr = getDateString(day);
                    const isToday = isSameDay(day, today);
                    const isSelected = isSameDay(day, selectedDate);
                    const hasNote = notes[dateStr];

                    let dayClasses = "relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 mx-auto";
                    if(isToday) dayClasses += " bg-accent-light dark:bg-accent-dark text-white font-bold";
                    if(isSelected) dayClasses += " ring-2 ring-offset-2 ring-accent-light dark:ring-accent-dark ring-offset-white dark:ring-offset-card-dark";
                    if(!isToday && !isSelected) dayClasses += " hover:bg-gray-100 dark:hover:bg-gray-700";
                    
                    return (
                        <div key={dateStr} onClick={() => setSelectedDate(day)} className={dayClasses}>
                            {day.getDate()}
                            {hasNote && <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
