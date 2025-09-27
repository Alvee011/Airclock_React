import React from 'react';

interface AppFooterProps {
    quote: { text: string; author: string; };
}

const AppFooter: React.FC<AppFooterProps> = ({ quote }) => {
    return (
        <>
            <div className="py-8 bg-white flex justify-center items-center text-center">
                <div className="max-w-3xl px-4">
                    <p className="font-mono italic font-bold text-lg md:text-xl text-gray-700">"{quote.text}"</p>
                    <p className="mt-2 text-gray-500">&ndash; {quote.author}</p>
                </div>
            </div>
            <footer className="bg-gray-100 dark:bg-card-dark text-gray-600 dark:text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <p className="text-center text-sm">&copy; {new Date().getFullYear()} AIRCLOCK. All rights reserved.</p>
                     <p className="text-center text-xs mt-2 opacity-70">Displays exact, official atomic clock time for any time zone.</p>
                </div>
            </footer>
        </>
    );
};

export default AppFooter;