export const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
export const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
export const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_TILE_KEY;
export const TILE_URL =
    process.env.EXPO_PUBLIC_TILE_URL_WEB ??
    `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
export const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors, &copy; MapTiler';
