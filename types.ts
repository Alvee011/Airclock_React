
export interface Clock {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: string | null;
  dst_offset: number;
  dst_until: string | null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
  // Custom properties
  offset: number;
  apiFailed: boolean;
  name?: string;
  country?: string;
  flag?: string;
}

export interface Settings {
  autoTheme: boolean;
  manualThemeDark: boolean;
  is24Hour: boolean;
  language: string;
}

export interface Alarm {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
  triggeredToday: boolean;
}

export interface Sound {
    name: string;
    videoId: string;
    icon: string;
}

export type Notes = Record<string, string>;

export enum Page {
  Time = 'time',
  Stopwatch = 'stopwatch',
  Timer = 'timer',
  Alarm = 'alarm'
}
