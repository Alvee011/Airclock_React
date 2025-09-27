
export const API_BASE_URL = 'https://worldtimeapi.org/api';

export const QUOTES = [
    { text: "Time is the richest gift, yet the poorest kept.", author: "Elena Marlowe" },
    { text: "We measure life in years but waste it in moments.", author: "Victor Hale" },
    { text: "The clock never stops, but we often pause for nothing.", author: "Marcus Linton" },
    { text: "We spend time like coins, forgetting there’s no way to earn them back.", author: "Adrian Cole" },
    { text: "Time is a canvas—some paint masterpieces, others leave it blank.", author: "Aria Sinclair" },
];

export const CITY_DATA = [
    { name: "New York", country: "USA", timezone: "America/New_York", flag: "🇺🇸" },
    { name: "London", country: "United Kingdom", timezone: "Europe/London", flag: "🇬🇧" },
    { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", flag: "🇯🇵" },
    { name: "Paris", country: "France", timezone: "Europe/Paris", flag: "🇫🇷" },
    { name: "Sydney", country: "Australia", timezone: "Australia/Sydney", flag: "🇦🇺" },
    { name: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka", flag: "🇧🇩" },
    { name: "Berlin", country: "Germany", timezone: "Europe/Berlin", flag: "🇩🇪" },
    { name: "Los Angeles", country: "USA", timezone: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "Chicago", country: "USA", timezone: "America/Chicago", flag: "🇺🇸" },
    { name: "Toronto", country: "Canada", timezone: "America/Toronto", flag: "🇨🇦" },
    { name: "Sao Paulo", country: "Brazil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
    { name: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", flag: "🇲🇽" },
    { name: "Moscow", country: "Russia", timezone: "Europe/Moscow", flag: "🇷🇺" },
    { name: "Dubai", country: "UAE", timezone: "Asia/Dubai", flag: "🇦🇪" },
    { name: "Mumbai", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Shanghai", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
    { name: "Seoul", country: "South Korea", timezone: "Asia/Seoul", flag: "🇰🇷" },
];

export const POPULAR_CITIES = [
    { name: "Abu Dhabi", size: 2, timezone: "Asia/Dubai" }, { name: "Amsterdam", size: 3, timezone: "Europe/Amsterdam" },
    { name: "Beijing", size: 5, timezone: "Asia/Shanghai" }, { name: "Berlin", size: 3, timezone: "Europe/Berlin" },
    { name: "Buenos Aires", size: 4, timezone: "America/Argentina/Buenos_aires" }, { name: "Cairo", size: 3, timezone: "Africa/Cairo" }, { name: "Chicago", size: 4, timezone: "America/Chicago" }, { name: "Delhi", size: 5, timezone: "Asia/Kolkata" },
    { name: "Dubai", size: 4, timezone: "Asia/Dubai" }, { name: "Istanbul", size: 5, timezone: "Europe/Istanbul" }, 
    { name: "London", size: 5, timezone: "Europe/London" }, { name: "Los Angeles", size: 5, timezone: "America/Los_Angeles" },
    { name: "Mexico City", size: 5, timezone: "America/Mexico_City" }, { name: "Moscow", size: 4, timezone: "Europe/Moscow" }, { name: "Mumbai", size: 4, timezone: "Asia/Kolkata" },
    { name: "New York", size: 5, timezone: "America/New_York" }, { name: "Paris", size: 4, timezone: "Europe/Paris" }, 
    { name: "Seoul", size: 4, timezone: "Asia/Seoul" }, { name: "Shanghai", size: 4, timezone: "Asia/Shanghai" }, { name: "Sydney", size: 4, timezone: "Australia/Sydney" }, { name: "São Paulo", size: 5, timezone: "America/Sao_Paulo" },
    { name: "Tokyo", size: 5, timezone: "Asia/Tokyo" },
];

export const TRANSLATIONS: Record<string, any> = {
    en: { name: "English", ui: { notes: "Notes for", calendar: "Calendar", settings: "Settings", theme: "Theme", autoTheme: "Auto Theme", darkMode: "Dark Mode", format: "Format", hourFormat: "24-Hour Format", language: "Language", reset: "Reset All Data", allNotes: "All Notes", showAllNotes: "Show All Notes", noNotes: "No notes found.", refresh: "Refresh Cards" }, placeholders: { search: "Search for a city or country...", notes: "Write something for the selected date...", alarmLabel: "Alarm label" }, alerts: { resetConfirm: "Are you sure? This will clear all pinned clocks and notes.", noPinned: "Search for a city to pin a clock." }, time: { ahead: "ahead", behind: "behind", same: "Same time", hour: "hour", hours: "hours" }, calendar: { months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    bn: { name: "বাংলা (Bangla)", ui: { notes: "নোট", calendar: "ক্যালেন্ডার", settings: "সেটিংস", theme: "থিম", autoTheme: "স্বয়ংক্রিয় থিম", darkMode: "ডার্ক মোড", format: "ফরম্যাট", hourFormat: "২৪-ঘন্টা ফরম্যাট", language: "ভাষা", reset: "সব ডেটা রিসেট করুন", allNotes: "সমস্ত নোট", showAllNotes: "সব নোট দেখুন", noNotes: "কোন নোট পাওয়া যায়নি।", refresh: "কার্ড রিফ্রেশ করুন" }, placeholders: { search: "শহর বা দেশ খুঁজুন...", notes: "কিছু লিখুন...", alarmLabel: "অ্যালার্ম লেবেল" }, alerts: { resetConfirm: "আপনি কি নিশ্চিত? এটি সমস্ত পিন করা ঘড়ি এবং নোট মুছে ফেলবে।", noPinned: "ঘড়ি পিন করতে একটি শহর অনুসন্ধান করুন।" }, time: { ahead: "এগিয়ে", behind: "পিছিয়ে", same: "একই সময়", hour: "ঘন্টা", hours: "ঘন্টা" }, calendar: { months: ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"], weekdays: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"] } },
    es: { name: "Español", ui: { notes: "Notas para", calendar: "Calendario", settings: "Ajustes", theme: "Tema", autoTheme: "Tema automático", darkMode: "Modo oscuro", format: "Formato", hourFormat: "Formato 24 horas", language: "Idioma", reset: "Restablecer datos", allNotes: "Todas las notas", showAllNotes: "Mostrar todas las notas", noNotes: "No se encontraron notas.", refresh: "Actualizar tarjetas" }, placeholders: { search: "Buscar una ciudad o país...", notes: "Escribe algo...", alarmLabel: "Etiqueta de alarma" }, alerts: { resetConfirm: "¿Estás seguro? Esto borrará todos los relojes y notas fijados.", noPinned: "Busca una ciudad para fijar un reloj." }, time: { ahead: "adelantado", behind: "atrasado", same: "Misma hora", hour: "hora", hours: "horas" }, calendar: { months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] } }
};
