import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  /** Safely read and parse JSON from localStorage */
  getItem<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn('StorageService.getItem parse error', e);
      return fallback;
    }
  }

  /** Safely stringify and write JSON to localStorage */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('StorageService.setItem write error', e);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
