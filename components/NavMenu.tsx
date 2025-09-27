/**
 * @file Renders the full-screen navigation menu for mobile devices.
 */
import React from 'react';
import { Page } from '../types';
import { CloseIcon } from './Icons';

interface NavMenuProps {
    /** Whether the menu is open. */
    isOpen: boolean;
    /** Callback to close the menu. */
    onClose: () => void;
    /** The currently active page. */
    currentPage: Page;
    /** Function to change the current page. */
    setCurrentPage: (page: Page) => void;
}

/**
 * The NavMenu component provides a full-screen overlay menu with links to the main pages.
 * It is only intended for use on smaller screens where the main header navigation is hidden.
 */
const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose, currentPage, setCurrentPage }) => {
    // Render nothing if the menu is not open.
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1050] flex flex-col justify-center items-center gap-8" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-3xl text-white"><CloseIcon/></button>
            {(Object.keys(Page) as Array<keyof typeof Page>).map(key => (
                <a 
                    key={key} 
                    href="#" 
                    onClick={(e) => { 
                        // Stop propagation to prevent the background click from also firing.
                        e.stopPropagation(); 
                        setCurrentPage(Page[key]); 
                        onClose(); 
                    }} 
                    className={`text-3xl font-bold text-white transition-colors ${currentPage === Page[key] ? 'text-accent-dark' : 'hover:text-accent-dark'}`}
                >
                    {Page[key]}
                </a>
            ))}
        </div>
    );
};

export default NavMenu;
