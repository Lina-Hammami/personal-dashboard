import { Component, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './layout/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Topbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private translate = inject(TranslateService);
  isDark = signal(false);

  constructor() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setLang(savedLang);

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('p-input-filled', true); // nicer inputs
    this.applyTheme(savedTheme === 'dark');
  }

  setLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  isRtl = () => (this.translate.currentLang || 'en') === 'ar';

  toggleTheme() {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    // Swap theme css at runtime (Lara light/dark)
    const head = document.head;
    let link = document.getElementById('theme-css') as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'theme-css';
      head.appendChild(link);
    }

    link.href = dark
      ? '@primeng/themes/lara/dark-blue/theme.css'
      : '@primeng/themes/lara/light-blue/theme.css';

  }
}
