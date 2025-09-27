
import React, { ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-xl' }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className={`relative w-11/12 ${maxWidth} rounded-2xl p-6 sm:p-8 bg-white dark:bg-card-dark text-gray-800 dark:text-gray-100 transition-transform duration-300 transform scale-100 shadow-lg flex flex-col max-h-[80vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-500/10 hover:dark:bg-gray-400/10">
                    <CloseIcon />
                </button>
                {children}
            </div>
        </div>
    );
};
