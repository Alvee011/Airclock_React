
import React from 'react';
import { Page } from '../types';
import { MenuIcon, SettingsIcon } from './Icons';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    onNavOpen: () => void;
    onSettingsOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, onNavOpen, onSettingsOpen }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-black/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setCurrentPage(Page.Time)}>AIRCLOCK</h1>
                <div className="flex items-center gap-2">
                    <button onClick={onNavOpen} className="md:hidden p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                        <MenuIcon/>
                    </button>
                    <nav className="hidden md:flex items-center gap-4">
                        {(Object.keys(Page) as Array<keyof typeof Page>).map(key => (
                           <a key={key} href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page[key]); }} className={`capitalize font-medium transition-colors ${currentPage === Page[key] ? 'text-accent-light dark:text-accent-dark' : 'hover:text-accent-light dark:hover:text-accent-dark'}`}>{Page[key]}</a>
                        ))}
                    </nav>
                    <button onClick={onSettingsOpen} className="p-2 rounded-full hover:bg-gray-500/10 transition-transform duration-500 ease-in-out hover:rotate-90">
                       <SettingsIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
