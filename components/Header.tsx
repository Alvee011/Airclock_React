/**
 * @file Renders the main header for the application.
 */

import React from 'react';
import { Page } from '../types';
import { MenuIcon, SettingsIcon } from './Icons';

// Paths to the logo assets, now absolute to the deployment subdirectory.
const logoBlackH = '/Airclock_React/images/LOGOBlackH.png';
const logoWhiteH = '/Airclock_React/images/LOGOWhiteH.png';

interface HeaderProps {
    /** The currently active page. */
    currentPage: Page;
    /** Function to change the current page. */
    setCurrentPage: (page: Page) => void;
    /** Callback to open the mobile navigation menu. */
    onNavOpen: () => void;
    /** Callback to open the settings modal. */
    onSettingsOpen: () => void;
}

/**
 * The Header component contains the app logo, main navigation for desktop,
 * and controls for opening the mobile menu and settings modal.
 */
const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, onNavOpen, onSettingsOpen }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-black/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Logo section that switches based on theme */}
                <div className="cursor-pointer" onClick={() => setCurrentPage(Page.Time)}>
                    {/* Light mode logo */}
                    <img src={logoBlackH} alt="AirClock Logo" className="h-8 w-auto dark:hidden" />
                    {/* Dark mode logo (only visible in dark mode) */}
                    <img src={logoWhiteH} alt="AirClock Logo" className="h-8 w-auto hidden dark:block" />
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Mobile menu button (hamburger icon), hidden on medium screens and up */}
                    <button onClick={onNavOpen} className="md:hidden p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                        <MenuIcon/>
                    </button>
                    
                    {/* Desktop navigation links */}
                    <nav className="hidden md:flex items-center gap-4">
                        {(Object.keys(Page) as Array<keyof typeof Page>).map(key => (
                           <a 
                                key={key} 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); setCurrentPage(Page[key]); }} 
                                className={`capitalize font-medium transition-colors ${currentPage === Page[key] ? 'text-accent-light dark:text-accent-dark' : 'hover:text-accent-light dark:hover:text-accent-dark'}`}
                            >
                                {Page[key]}
                            </a>
                        ))}
                    </nav>
                    
                    {/* Settings button (gear icon) */}
                    <button onClick={onSettingsOpen} className="p-2 rounded-full hover:bg-gray-500/10 transition-transform duration-500 ease-in-out hover:rotate-90">
                       <SettingsIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;