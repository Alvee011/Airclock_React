/**
 * @file A reusable, styled toggle switch component.
 */

import React from 'react';

interface ToggleSwitchProps {
    /** The current state of the switch (on/off). */
    checked: boolean;
    /** Callback function to handle state changes. */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Whether the switch is disabled. */
    disabled?: boolean;
}

/**
 * A styled checkbox input that looks like a toggle switch.
 * It's used for boolean settings throughout the application.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange} 
            disabled={disabled} 
            className="sr-only peer" // Hide the default checkbox
        />
        {/* Custom styling for the switch track and thumb */}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent-light dark:peer-checked:bg-accent-dark"></div>
    </label>
);

export default ToggleSwitch;
