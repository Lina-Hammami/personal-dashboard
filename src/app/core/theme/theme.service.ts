import { Injectable, signal } from '@angular/core';

type ThemeKey = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly lightCss = 'node_modules/primeng/resources/themes/lara-light-blue/theme.css';
  private readonly darkCss  = 'node_modules/primeng/resources/themes/lara-dark-blue/theme.css';

  mode = signal<ThemeKey>((localStorage.getItem('theme-mode') as ThemeKey) || 'light');

  constructor() {
    this.apply(this.mode());
  }

  toggle() { this.set(this.mode() === 'light' ? 'dark' : 'light'); }

  set(m: ThemeKey) {
    this.mode.set(m);
    localStorage.setItem('theme-mode', m);
    this.apply(m);
  }

  private apply(mode: ThemeKey) {
    const id = 'primeng-theme';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = id;
      document.head.appendChild(link);
    }
    link.href = mode === 'dark' ? this.darkCss : this.lightCss;
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}
