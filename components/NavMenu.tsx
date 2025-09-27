
import React from 'react';
import { Page } from '../types';
import { CloseIcon } from './Icons';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose, currentPage, setCurrentPage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1050] flex flex-col justify-center items-center gap-8" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-3xl text-white"><CloseIcon/></button>
            {(Object.keys(Page) as Array<keyof typeof Page>).map(key => (
                <a 
                    key={key} 
                    href="#" 
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(Page[key]); onClose(); }} 
                    className={`text-3xl font-bold text-white transition-colors ${currentPage === Page[key] ? 'text-accent-dark' : 'hover:text-accent-dark'}`}
                >
                    {Page[key]}
                </a>
            ))}
        </div>
    );
};

export default NavMenu;
