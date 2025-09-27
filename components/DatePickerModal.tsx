/**
 * @file Renders a modal for quickly selecting a month and year for the calendar.
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface DatePickerModalProps {
    /** Whether the modal is open. */
    isOpen: boolean;
    /** Callback to close the modal. */
    onClose: () => void;
    /** The date that determines the currently displayed year. */
    currentCalendarDate: Date;
    /** Callback to set the new month and year in the main calendar view. */
    setCurrentCalendarDate: (date: Date) => void;
    /** The translation object. */
    t: any;
}

/**
 * The DatePickerModal provides a UI for users to quickly navigate to a different
 * month or year in the calendar view, instead of clicking through month by month.
 */
const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, onClose, currentCalendarDate, setCurrentCalendarDate, t }) => {
    // Local state for the year being displayed/edited in the modal.
    const [year, setYear] = useState(currentCalendarDate.getFullYear());

    // Effect to reset the modal's year to the calendar's current year whenever the modal is opened.
    useEffect(() => {
        if (isOpen) {
            setYear(currentCalendarDate.getFullYear());
        }
    }, [isOpen, currentCalendarDate]);

    // Handles selecting a month. It updates the main calendar's date and closes the modal.
    const handleMonthSelect = (month: number) => {
        setCurrentCalendarDate(new Date(year, month, 1));
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
            {/* Year selection controls */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-full hover:bg-gray-500/10"><ChevronLeftIcon/></button>
                <input 
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                    className="font-bold text-lg text-center bg-transparent w-24 outline-none focus:ring-2 focus:ring-accent-light rounded-md"
                />
                <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-full hover:bg-gray-500/10"><ChevronRightIcon/></button>
            </div>
            {/* Grid of months */}
            <div className="grid grid-cols-3 gap-2">
                {t.calendar.months.map((month: string, index: number) => (
                    <button 
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`p-3 rounded-lg text-center transition-colors ${
                            currentCalendarDate.getMonth() === index && currentCalendarDate.getFullYear() === year 
                            ? 'bg-accent-light dark:bg-accent-dark text-white' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {month.substring(0,3)}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default DatePickerModal;
