/**
 * @file Renders the main footer for the application.
 */
import React from 'react';
import QuoteDisplay from './QuoteDisplay';

// Paths to the logo assets, now absolute to the deployment subdirectory.
const logoBlack = '/Airclock_React/assets/images/logoblack.png';
const logoWhite = '/Airclock_React/assets/images/logowhite.png';

/**
 * The AppFooter component displays a "quote of the day" and standard footer content
 * like the copyright notice and the app logo.
 */
const AppFooter: React.FC = () => {
    return (
        <>
            <QuoteDisplay />
            
            {/* Main Footer Section */}
            <footer className="bg-gray-100 dark:bg-card-dark text-gray-600 dark:text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Logo that switches with theme */}
                    <div className="mb-6 flex justify-center">
                        <img src={logoBlack} alt="AirClock Logo" className="h-10 w-auto dark:hidden" />
                        <img src={logoWhite} alt="AirClock Logo" className="h-10 w-auto hidden dark:block" />
                    </div>
                     <p className="text-sm">&copy; {new Date().getFullYear()} AIRCLOCK. All rights reserved.</p>
                     <p className="text-xs mt-2 opacity-70">Displays exact, official atomic clock time for any time zone.</p>
                </div>
            </footer>
        </>
    );
};

export default AppFooter;