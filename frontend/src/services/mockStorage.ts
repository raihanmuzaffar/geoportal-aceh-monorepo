/**
 * Local storage helper for mock/offline resilience
 */

export function loadStoredData<T>(storageKey: string, fallbackData: T[]): T[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      localStorage.setItem(storageKey, JSON.stringify(fallbackData));
      return fallbackData;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return fallbackData;
  }
}

export function saveStoredData<T>(storageKey: string, data: T[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Silently ignore storage quota errors in demo mode
  }
}
