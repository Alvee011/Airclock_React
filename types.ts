/**
 * @file This file contains all the core TypeScript types and interfaces used throughout the AirClock application.
 */

/**
 * Represents the data structure for a clock, fetched from the WorldTimeAPI.
 * It includes timezone information, offsets, and custom properties for the UI.
 */
export interface Clock {
  /** The timezone's abbreviated name (e.g., "CEST"). */
  abbreviation: string;
  /** The client's IP address as detected by the API. */
  client_ip: string;
  /** The current date and time in ISO 8601 format for the timezone. */
  datetime: string;
  /** The day of the week (1=Monday, 7=Sunday). */
  day_of_week: number;
  /** The day of the year (1-366). */
  day_of_year: number;
  /** A boolean indicating if daylight saving time is active. */
  dst: boolean;
  /** The ISO 8601 timestamp when daylight saving time started, or null. */
  dst_from: string | null;
  /** The offset from DST in seconds. */
  dst_offset: number;
  /** The ISO 8601 timestamp when daylight saving time ends, or null. */
  dst_until: string | null;
  /** The raw offset from UTC in seconds (without DST). */
  raw_offset: number;
  /** The full timezone name (e.g., "Europe/Berlin"). */
  timezone: string;
  /** The current Unix time in seconds. */
  unixtime: number;
  /** The current UTC date and time in ISO 8601 format. */
  utc_datetime: string;
  /** The UTC offset string (e.g., "+02:00"). */
  utc_offset: string;
  /** The week number of the year. */
  week_number: number;
  
  // --- Custom properties added by the application ---
  
  /** A flag to indicate if the API call for this clock failed. */
  apiFailed: boolean;
  /** The display name of the city (e.g., "Berlin"). */
  name?: string;
  /** The name of the country. */
  country?: string;
  /** The emoji flag representing the country. */
  flag?: string;
}

/**
 * Defines the structure for user-configurable settings.
 */
export interface Settings {
  /** If true, the theme changes automatically based on local time (day/night). */
  autoTheme: boolean;
  /** If autoTheme is false, this determines if dark mode is on. */
  manualThemeDark: boolean;
  /** If true, time is displayed in 24-hour format. */
  is24Hour: boolean;
  /** The selected language for the UI, represented by its code (e.g., "en"). */
  language: string;
}

/**
 * Represents a single alarm set by the user.
 */
export interface Alarm {
  /** A unique identifier for the alarm (usually a timestamp). */
  id: number;
  /** The time the alarm is set for, in "HH:mm" format. */
  time: string;
  /** A user-defined label for the alarm. */
  label: string;
  /** A boolean indicating if the alarm is active. */
  enabled: boolean;
  /** A transient state to track if the alarm has already been triggered today to prevent re-triggering. Not persisted. */
  triggeredToday: boolean;
}

/**
 * Represents a focus sound option.
 */
export interface Sound {
    /** The display name of the sound (e.g., "Rain"). */
    name: string;
    /** The YouTube video ID for the ambient sound. */
    videoId: string;
    /** An emoji icon representing the sound. */
    icon: string;
}

/**
 * Defines the structure for storing notes, mapping a date string ("YYYY-MM-DD") to the note content.
 */
export type Notes = Record<string, string>;

/**
 * An enumeration of the main pages/views in the application.
 * This helps in managing navigation and rendering the correct component.
 */
export enum Page {
  Time = 'time',
  Stopwatch = 'stopwatch',
  Timer = 'timer',
  Alarm = 'alarm'
}