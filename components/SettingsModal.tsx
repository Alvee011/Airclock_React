/**
 * @file Renders a modal for configuring user settings.
 */

import React from 'react';
import { Settings } from '../types';
import { TRANSLATIONS } from '../constants';
import { Modal } from './Modal';
import ToggleSwitch from './ToggleSwitch';

interface SettingsModalProps {
    /** Whether the modal is open. */
    isOpen: boolean;
    /** Callback to close the modal. */
    onClose: () => void;
    /** The current settings object. */
    settings: Settings;
    /** Function to update the settings state. */
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    /** The translation object. */
    t: any;
}

/**
 * The SettingsModal component provides a UI for users to change application settings,
 * such as theme, time format, and language.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings, t }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">{t.ui.settings}</h2>
            <div className="space-y-6">
                {/* Theme Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-accent-light dark:text-accent-dark mb-3">{t.ui.theme}</h3>
                    <div className="flex items-center justify-between py-2">
                        <span>{t.ui.autoTheme}</span>
                        <ToggleSwitch 
                            checked={settings.autoTheme} 
                            onChange={e => setSettings({...settings, autoTheme: e.target.checked})} 
                        />
                    </div>
                    {/* Manual dark mode toggle is disabled if auto theme is on */}
                    <div className={`flex items-center justify-between py-2 transition-opacity ${settings.autoTheme ? 'opacity-50' : 'opacity-100'}`}>
                        <span>{t.ui.darkMode}</span>
                        <ToggleSwitch 
                            checked={settings.manualThemeDark} 
                            onChange={e => setSettings({...settings, manualThemeDark: e.target.checked})} 
                            disabled={settings.autoTheme} 
                        />
                    </div>
                </div>
                {/* Time Format Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-accent-light dark:text-accent-dark mb-3">{t.ui.format}</h3>
                    <div className="flex items-center justify-between py-2">
                        <span>{t.ui.hourFormat}</span>
                        <ToggleSwitch 
                            checked={settings.is24Hour} 
                            onChange={e => setSettings({...settings, is24Hour: e.target.checked})} 
                        />
                    </div>
                </div>
                {/* Language Settings */}
                 <div>
                    <h3 className="text-lg font-semibold text-accent-light dark:text-accent-dark mb-3">{t.ui.language}</h3>
                    <select value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        {Object.keys(TRANSLATIONS).map(lang => (
                            <option key={lang} value={lang}>{TRANSLATIONS[lang].name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
