// Base URL for the backend API, read from the .env file.
// While USE_MOCK_API is true, the services below use mock data and never call this URL.
// To connect a real backend: set USE_MOCK_API to false and use fetch(`${API_BASE_URL}/...`).
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';
export const USE_MOCK_API = true;
