/**
 * @file A reusable Modal component for displaying content in a dialog overlay.
 */

import React, { ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
    /** Whether the modal is currently open and visible. */
    isOpen: boolean;
    /** Callback function to close the modal. */
    onClose: () => void;
    /** The content to be displayed inside the modal. */
    children: ReactNode;
    /** Optional Tailwind CSS class for setting the maximum width of the modal. */
    maxWidth?: string;
}

/**
 * A generic, accessible modal component with a backdrop and a close button.
 * Clicking the backdrop or the close button will trigger the `onClose` callback.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-xl' }) => {
    // Don't render anything if the modal is not open.
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] transition-opacity duration-300"
            onClick={onClose} // Close modal when clicking the backdrop
        >
            <div 
                className={`relative w-11/12 ${maxWidth} rounded-2xl p-6 sm:p-8 bg-white dark:bg-card-dark text-gray-800 dark:text-gray-100 transition-transform duration-300 transform scale-100 shadow-lg flex flex-col max-h-[80vh]`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-500/10 hover:dark:bg-gray-400/10">
                    <CloseIcon />
                </button>
                {children}
            </div>
        </div>
    );
};
