/**
 * @file This file contains simple SVG and text-based icon components used throughout the UI.
 */
import React from 'react';

/** A gear icon for settings. */
export const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82 2 2 0 1 1-2.83 2.83 1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51A2 2 0 1 1 9.9 21a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33 2 2 0 1 1-2.83-2.83 1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1A2 2 0 1 1 3 9.9a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82 2 2 0 1 1 2.83-2.83 1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51A2 2 0 1 1 14.1 3a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33 2 2 0 1 1 2.83 2.83 1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1A2 2 0 1 1 21 14.1a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

/** A hamburger menu icon. */
export const MenuIcon = () => <span>☰</span>;

/** A close (X) icon. */
export const CloseIcon = () => <span>✕</span>;

/** A left-pointing chevron icon. */
export const ChevronLeftIcon = () => <span>◀</span>;

/** A right-pointing chevron icon. */
export const ChevronRightIcon = () => <span>▶</span>;
