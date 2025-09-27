/**
 * @file Renders the "Quote of the Day" section.
 */
import React, { useMemo } from 'react';
import { QUOTES } from '../constants';

/**
 * A component dedicated to selecting and displaying a unique quote for the current day.
 * The quote is determined by the day of the year, ensuring it changes daily and does
 * not repeat within a year (assuming the quote list is long enough).
 */
const QuoteDisplay: React.FC = () => {
    // Memoized calculation for the quote of the day. It only recalculates when the day changes.
    const quote = useMemo(() => {
        const now = new Date();
        // Calculate the day of the year (1-366).
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        // Use the day of the year to pick a quote from the list, wrapping around if needed.
        return QUOTES[dayOfYear % QUOTES.length];
    }, []);

    return (
        <div className="py-8 bg-white flex justify-center items-center text-center">
            <div className="max-w-3xl px-4">
                <p className="font-mono italic font-bold text-lg md:text-xl text-gray-700">"{quote.text}"</p>
                <p className="mt-2 text-gray-500">&ndash; {quote.author}</p>
            </div>
        </div>
    );
};

export default QuoteDisplay;