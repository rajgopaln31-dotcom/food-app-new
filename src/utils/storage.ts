// Small helpers to save / load data in the browser's localStorage.
// We use them so the cart, login and orders survive a page refresh.

export const STORAGE_KEYS = {
  user: 'fd_user',
  users: 'fd_users',
  cart: 'fd_cart',
  address: 'fd_address',
  favourites: 'fd_favourites',
  orders: 'fd_orders',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode). The app still works without it.
  }
}
