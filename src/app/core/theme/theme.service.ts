import { Injectable, signal } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; // choose your preset (Lara, Nora, Aura, Material, etc.)

type ThemeKey = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private primeng = new PrimeNG();
  mode = signal<ThemeKey>((localStorage.getItem('theme-mode') as ThemeKey) || 'light');

  constructor() {
    this.apply(this.mode());
  }

  toggle() {
    this.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  set(mode: ThemeKey) {
    this.mode.set(mode);
    localStorage.setItem('theme-mode', mode);
    this.apply(mode);
  }

  private apply(mode: ThemeKey) {
    // tell PrimeNG to switch theme palette dynamically
    this.primeng.onThemeChange({
      preset: Aura,
      options: {
        darkMode: mode === 'dark',
      },
    });

    // optional: update <html> class for custom CSS
    document.documentElement.classList.toggle('app-dark', mode === 'dark');
  }
}
